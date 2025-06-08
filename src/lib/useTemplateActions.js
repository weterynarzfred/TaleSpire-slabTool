import { useState, useRef } from "react";
import { compressToBase64, decompressFromBase64, truncate } from "../lib/templateUtils";
import useToast from "../lib/useToast";

export default function useTemplateActions(items, setItems, state, dispatch) {
  const [activeId, setActiveId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [newTemplateName, setNewTemplateName] = useState("");
  const [importInput, setImportInput] = useState("");
  const renameInputRef = useRef(null);
  const [toastMessage, showToast] = useToast();

  const saveItems = (updated) => {
    setItems(updated);
    TS.localStorage.global.setBlob(JSON.stringify(updated));
  };

  const handleTemplateSave = () => {
    const baseName = newTemplateName.trim() || "New Template";
    const newTemplate = {
      id: crypto.randomUUID(),
      type: "template",
      name: baseName,
      blocks: state.blocks,
      templateHeader: typeof state.templateHeader === "string"
        ? state.templateHeader
        : JSON.stringify(state.templateHeader, null, 2),
    };
    saveItems([...items, newTemplate]);
    setNewTemplateName("");
  };

  const handleTemplateDelete = (id) => {
    saveItems(items.filter((item) => item.id !== id));
    if (renamingId === id) setRenamingId(null);
  };

  const handleTemplateLoad = (template) => {
    dispatch({
      type: "REPLACE_BLOCKS",
      value: { blocks: template.blocks, templateHeader: template.templateHeader },
    });
  };

  const handleRenameStart = (id) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    setRenamingId(id);
    setEditingName(item.name);
  };

  const handleRenameSubmit = () => {
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

        let rawName =
          entry.name?.trim() ||
          (typeof entry.templateHeader === "string"
            ? entry.templateHeader.trim()
            : undefined);
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

  const handleSortTemplates = () => {
    const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));
    saveItems(sorted);
    showToast("Templates sorted A → Z");
  };

  return {
    activeId,
    renamingId,
    editingName,
    newTemplateName,
    importInput,
    renameInputRef,
    toastMessage,
    setActiveId,
    setEditingName,
    setNewTemplateName,
    setImportInput,
    handleTemplateSave,
    handleTemplateDelete,
    handleTemplateLoad,
    handleRenameStart,
    handleRenameSubmit,
    handleDragEnd,
    handleCopyTemplate,
    handleCopyAllTemplates,
    handleImportTemplate,
    handleSortTemplates,
  };
}
