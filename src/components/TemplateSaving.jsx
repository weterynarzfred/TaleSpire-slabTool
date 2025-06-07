import { useEffect, useState, useRef } from "react";
import { useTrackedState, useUpdate } from "./StateProvider";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import pako from "pako";

const compressToBase64 = (jsonStr) =>
  btoa(String.fromCharCode(...pako.deflate(jsonStr)));

const decompressFromBase64 = (base64Str) => {
  const binary = atob(base64Str);
  const compressed = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return pako.inflate(compressed, { to: "string" });
};

function SortableItem({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="sortable-item"
    >
      <div
        ref={setActivatorNodeRef}
        {...listeners}
        {...attributes}
        className="drag-handle"
      >
        ☰
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

function useToast(duration = 1500) {
  const [message, setMessage] = useState("");
  const timeoutRef = useRef(null);

  const showToast = (msg) => {
    setMessage(msg);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setMessage(""), duration);
  };

  return [message, showToast];
}

export default function TemplateSaving() {
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [renamingId, setRenamingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [newTemplateName, setNewTemplateName] = useState("");
  const [importInput, setImportInput] = useState("");

  const [toastMessage, showToast] = useToast();

  const state = useTrackedState();
  const dispatch = useUpdate();

  const renameInputRef = useRef(null);
  const sensors = useSensors(useSensor(PointerSensor));

  // Persist items to localStorage & state
  const saveItems = (updated) => {
    setItems(updated);
    TS.localStorage.global.setBlob(JSON.stringify(updated));
  };

  useEffect(() => {
    (async () => {
      const saved = JSON.parse((await TS.localStorage.global.getBlob()) || "[]");
      setItems(saved);
    })();
  }, []);

  // Focus input when renaming
  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  const truncate = (str, maxLen = 35) =>
    str.length > maxLen ? str.slice(0, maxLen - 3) + "..." : str;

  // Handlers

  const handleInputChange = (e) =>
    dispatch({ type: "REPLACE_BLOCKS", value: e.currentTarget.value });

  const handleTemplateSave = () => {
    const name = newTemplateName.trim() || `${Date.now()}`;
    const newTemplate = {
      id: crypto.randomUUID(),
      type: "template",
      name,
      blocks: state.blocks,
      templateHeader:
        typeof state.templateHeader === "string"
          ? state.templateHeader
          : JSON.stringify(state.templateHeader, null, 2),
    };
    saveItems([...items, newTemplate]);
    setNewTemplateName("");
  };

  const handleTemplateDelete = (id) => {
    saveItems(items.filter((item) => item.id !== id));
  };

  const handleTemplateLoad = (template) => {
    dispatch({
      type: "REPLACE_BLOCKS",
      value: { blocks: template.blocks, templateHeader: template.templateHeader },
    });
  };

  const handleRenameStart = (id) => {
    setRenamingId(id);
    const item = items.find((i) => i.id === id);
    setEditingName(item?.name || "");
  };

  const handleRenameSubmit = () => {
    if (!renamingId) return;
    const trimmed = editingName.trim();
    if (!trimmed) {
      setRenamingId(null);
      return;
    }
    const updated = items.map((item) =>
      item.id === renamingId ? { ...item, name: trimmed } : item
    );
    saveItems(updated);
    setRenamingId(null);
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over) return setActiveId(null);
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
      saveItems(arrayMove(items, oldIndex, newIndex));
    }
    setActiveId(null);
  };

  const toggleFolder = (id) => {
    const updated = new Set(expandedFolders);
    updated.has(id) ? updated.delete(id) : updated.add(id);
    setExpandedFolders(updated);
  };

  const handleCopyTemplate = async (template) => {
    try {
      const base64 = compressToBase64(
        JSON.stringify({
          name: template.name,
          blocks: template.blocks,
          templateHeader: template.templateHeader,
        })
      );
      await navigator.clipboard.writeText(base64);
      showToast(`Template "${truncate(template.name)}" copied!`);
    } catch (e) {
      console.error("Copy failed:", e);
    }
  };

  const handleCopyAllTemplates = async () => {
    try {
      const base64 = compressToBase64(JSON.stringify(items));
      await navigator.clipboard.writeText(base64);
      showToast("All templates copied!");
    } catch {
      alert("Failed to copy templates.");
    }
  };

  const handleImportTemplate = () => {
    let parsed;
    try {
      parsed = JSON.parse(decompressFromBase64(importInput));
    } catch {
      try {
        parsed = JSON.parse(importInput);
      } catch {
        alert("Invalid JSON or compressed data.");
        return;
      }
    }

    const existingIds = new Set(items.map((i) => i.id));
    const existingNames = new Set(items.map((i) => i.name));
    const newTemplates = [];

    const normalizeTemplates = (input) => {
      const arr = Array.isArray(input) ? input : [input];
      for (const entry of arr) {
        if (!entry.blocks) continue;
        let newId = crypto.randomUUID();
        while (existingIds.has(newId)) newId = crypto.randomUUID();

        let rawName = entry.name?.trim() || (typeof entry.templateHeader === "string" ? entry.templateHeader.trim() : undefined);
        let baseName = rawName?.replace(/\s+-\s+copy(?:\s+\d+)?$/, "") || `Imported ${Date.now()}`;
        let finalName = baseName;
        let counter = 1;
        while (existingNames.has(finalName)) {
          finalName = `${baseName} - copy${counter > 1 ? ` ${counter}` : ""}`;
          counter++;
        }
        existingNames.add(finalName);

        newTemplates.push({
          id: newId,
          type: "template",
          name: finalName,
          blocks: entry.blocks,
          templateHeader:
            typeof entry.templateHeader === "string"
              ? entry.templateHeader
              : JSON.stringify(entry.templateHeader || {}, null, 2),
        });
      }
    };

    normalizeTemplates(parsed);

    if (!newTemplates.length) {
      alert("No valid templates found to import.");
      return;
    }

    saveItems([...items, ...newTemplates]);
    setImportInput("");
    showToast(`${newTemplates.length} template(s) imported!`);
  };

  const renderItems = (list) => (
    <SortableContext items={list.map(({ id }) => id)} strategy={verticalListSortingStrategy}>
      {list.map((item) => (
        <SortableItem key={item.id} id={item.id}>
          <div className="template-item">
            {item.type === "folder" ? (
              <>
                <div className="template-folder-toggle" onClick={() => toggleFolder(item.id)}>
                  ► {item.name}
                </div>
                {expandedFolders.has(item.id) && (
                  <div className="folder-contents">{renderItems(item.children || [])}</div>
                )}
              </>
            ) : renamingId === item.id ? (
              <input
                ref={renameInputRef}
                className="template-name-input"
                type="text"
                spellCheck={false}
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={handleRenameSubmit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleRenameSubmit();
                  }
                  if (e.key === "Escape") setRenamingId(null);
                }}
                autoFocus
              />
            ) : (
              <>
                <button className="template-name" onClick={() => handleTemplateLoad(item)}>
                  {item.name}
                </button>
                <button onClick={() => handleRenameStart(item.id)}>rename</button>
                <button onClick={() => handleCopyTemplate(item)}>copy</button>
                <button onClick={() => handleTemplateDelete(item.id)}>x</button>
              </>
            )}
          </div>
        </SortableItem>
      ))}
    </SortableContext>
  );

  return (
    <div className="TemplateSaving block--results">
      <div className="BlockHeader">
        <div className="block__title-bar">
          <div className="block__title">templates</div>
        </div>
      </div>

      <div className="template-save-wrapper">
        <input
          type="text"
          placeholder="Template Name"
          spellCheck={false}
          value={newTemplateName}
          onChange={(e) => setNewTemplateName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleTemplateSave())}
        />
        <button className="template-menu-button" onClick={handleTemplateSave}>
          save template
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={({ active }) => setActiveId(active.id)}
      >
        {renderItems(items)}
        <DragOverlay>
          {activeId ? (
            <div className="template-item drag-overlay">
              {items.find((i) => i.id === activeId)?.name || "Dragging..."}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <div className="template-import-wrapper">
        <div className="template-menu">
          <button className="template-menu-button" onClick={handleImportTemplate}>
            Import template
          </button>

          <button className="template-menu-button" onClick={handleCopyAllTemplates}>
            Copy all templates
          </button>
        </div>
        <textarea
          className="template-import-textarea"
          placeholder="Paste template(s) to be imported here."
          value={importInput}
          onChange={(e) => setImportInput(e.target.value)}
          rows={6}
          spellCheck={false}
        />
      </div>

      {toastMessage && <div className="toast">{toastMessage}</div>}
    </div>
  );
}
