import { useEffect, useState, useRef } from "react";
import { useTrackedState, useUpdate } from './StateProvider';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import pako from 'pako';

function compressToBase64(jsonString) {
  const compressed = pako.deflate(jsonString);
  let binary = '';
  for (let i = 0; i < compressed.length; i++) {
    binary += String.fromCharCode(compressed[i]);
  }
  return btoa(binary);
}

function decompressFromBase64(base64String) {
  const binary = atob(base64String);
  const compressed = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    compressed[i] = binary.charCodeAt(i);
  }
  return pako.inflate(compressed, { to: 'string' });
}

function SortableItem({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="sortable-item">
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

export default function TemplateSaving() {
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [renaming, setRenaming] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [newTemplateName, setNewTemplateName] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const toastTimeoutRef = useRef(null);

  const state = useTrackedState();
  const dispatch = useUpdate();

  const renameInputRef = useRef(null);
  const sensors = useSensors(useSensor(PointerSensor));

  function showToast(message) {
    setToastMessage(message);
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage("");
      toastTimeoutRef.current = null;
    }, 1500);
  }

  const saveItems = (updated) => {
    setItems(updated);
    TS.localStorage.global.setBlob(JSON.stringify(updated));
  };

  const handleInputChange = (e) => {
    dispatch({ type: 'REPLACE_BLOCKS', value: e.currentTarget.value });
  };

  const handleTemplateSave = () => {
    const name = newTemplateName.trim() || `${Date.now()}`;
    const updated = [...items, {
      id: crypto.randomUUID(),
      type: 'template',
      name,
      blocks: state.blocks,
      templateHeader: typeof state.templateHeader === 'string'
        ? state.templateHeader
        : JSON.stringify(state.templateHeader, null, 2),
    }];
    saveItems(updated);
    setNewTemplateName("");
  };

  const handleTemplateDelete = (id) => {
    const updated = items.filter(item => item.id !== id);
    saveItems(updated);
  };

  const handleTemplateLoad = (template) => {
    dispatch({
      type: 'REPLACE_BLOCKS',
      value: { blocks: template.blocks, templateHeader: template.templateHeader },
    });
  };

  const handleTemplateRenameButton = (id) => {
    setRenaming(id);
    const item = items.find(i => i.id === id);
    setEditingName(item ? item.name : "");
  };

  const handleRenameSubmit = () => {
    if (!renaming) return;
    const updated = items.map(item =>
      item.id === renaming ? { ...item, name: editingName.trim() || item.name } : item
    );
    saveItems(updated);
    setRenaming(null);
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;
    const oldIndex = items.findIndex(item => item.id === active.id);
    const newIndex = items.findIndex(item => item.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      const updated = arrayMove(items, oldIndex, newIndex);
      saveItems(updated);
    }
    setActiveId(null);
  };

  const toggleFolder = (id) => {
    const updated = new Set(expandedFolders);
    updated.has(id) ? updated.delete(id) : updated.add(id);
    setExpandedFolders(updated);
  };

  const truncate = (str, maxLength = 35) => {
    return str.length > maxLength ? str.slice(0, maxLength - 3) + "..." : str;
  };

  // COPY SINGLE TEMPLATE (compressed)
  const handleCopyTemplate = async (template) => {
    try {
      const json = JSON.stringify({
        name: template.name,
        blocks: template.blocks,
        templateHeader: template.templateHeader,
      });

      const base64 = compressToBase64(json);

      await navigator.clipboard.writeText(base64);
      showToast(`Template "${truncate(template.name)}" has been copied!`);
    } catch (err) {
      console.error("Failed to copy template JSON:", err);
    }
  };

  // COPY ALL TEMPLATES (compressed)
  const handleCopyAllTemplates = async () => {
    try {
      const json = JSON.stringify(items);
      const base64 = compressToBase64(json);
      await navigator.clipboard.writeText(base64);
      showToast("All templates copied!");
    } catch (err) {
      alert("Failed to copy templates.");
    }
  };

  useEffect(() => {
    (async () => {
      const saved = JSON.parse(await TS.localStorage.global.getBlob() || '[]');
      setItems(saved);
    })();
  }, []);

  useEffect(() => {
    if (renaming && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renaming]);

  const renderItems = (items) => (
    <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
      {items.map((item) => (
        <SortableItem key={item.id} id={item.id}>
          <div className="template-item">
            {item.type === 'folder' ? (
              <>
                <div className="template-folder-toggle" onClick={() => toggleFolder(item.id)}>
                  ► {item.name}
                </div>
                {expandedFolders.has(item.id) && (
                  <div className="folder-contents">
                    {renderItems(item.children || [])}
                  </div>
                )}
              </>
            ) : (
              <>
                {renaming === item.id ? (
                  <input
                    ref={renameInputRef}
                    className="template-name-input"
                    type="text"
                    spellCheck={false}
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={handleRenameSubmit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleRenameSubmit();
                      }
                      if (e.key === 'Escape') {
                        setRenaming(null);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <button className="template-name" onClick={() => handleTemplateLoad(item)}>
                    {item.name}
                  </button>
                )}
                <button onClick={() => handleTemplateRenameButton(item.id)}>rename</button>
                <button onClick={() => handleCopyTemplate(item)}>copy</button>
                <button onClick={() => handleTemplateDelete(item.id)}>x</button>
              </>
            )}
          </div>
        </SortableItem>
      ))}
    </SortableContext>
  );

  const [importInput, setImportInput] = useState("");

  const handleImportTemplate = () => {
    let parsed;

    try {
      // Try decompressing base64 compressed input first
      parsed = JSON.parse(decompressFromBase64(importInput));
    } catch {
      try {
        // Fallback: try parsing as plain JSON string
        parsed = JSON.parse(importInput);
      } catch (err) {
        alert("Invalid JSON or compressed data.");
        return;
      }
    }

    const existingIds = new Set(items.map(i => i.id));
    const existingNames = new Set(items.map(i => i.name));
    const newTemplates = [];

    const normalizeTemplates = (input) => {
      const array = Array.isArray(input) ? input : [input];

      for (const entry of array) {
        if (!entry.blocks) continue;

        let newId = crypto.randomUUID();
        while (existingIds.has(newId)) {
          newId = crypto.randomUUID();
        }

        let rawName = entry.name?.trim() || (typeof entry.templateHeader === 'string' ? entry.templateHeader.trim() : undefined);
        let baseName = rawName?.replace(/\s+-\s+copy(?:\s+\d+)?$/, '') || `Imported ${Date.now()}`;

        let finalName = baseName;
        let counter = 1;
        while (existingNames.has(finalName)) {
          finalName = `${baseName} - copy${counter > 1 ? ` ${counter}` : ''}`;
          counter++;
        }
        existingNames.add(finalName);

        newTemplates.push({
          id: newId,
          type: 'template',
          name: finalName,
          blocks: entry.blocks,
          templateHeader: typeof entry.templateHeader === 'string'
            ? entry.templateHeader
            : JSON.stringify(entry.templateHeader || {}, null, 2),
        });
      }
    };

    normalizeTemplates(parsed);

    if (newTemplates.length === 0) {
      alert("No valid templates found to import.");
      return;
    }

    const updated = [...items, ...newTemplates];
    saveItems(updated);
    setImportInput("");
    showToast(`${newTemplates.length} template(s) imported!`);
  };

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
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleTemplateSave();
            }
          }}
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
              {items.find(item => item.id === activeId)?.name || "Dragging..."}
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

      {toastMessage && (
        <div className="toast">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
