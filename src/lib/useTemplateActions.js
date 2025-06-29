import { useState, useRef } from "react";
import { compressToBase64, decompressFromBase64, truncate } from "../lib/templateUtils";
import useToast from "../lib/useToast";
import { computeTemplateResult } from "../lib/computeTemplateResult";

export default function useTemplateActions(items, setItems, state, dispatch, collapsed) {
  const [activeId, setActiveId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [newTemplateName, setNewTemplateName] = useState("");
  const [importInput, setImportInput] = useState("");
  const [dragOverlayLabel, setDragOverlayLabel] = useState("");
  const renameInputRef = useRef(null);
  const [toastMessage, showToast] = useToast();

  const saveItems = (updatedItems, collapsedIds = null) => {
    setItems(updatedItems);
    TS.localStorage.global.setBlob(
      JSON.stringify({
        items: updatedItems,
        collapsed: collapsedIds ?? Array.from(collapsed),
      })
    );
  };

  const updateItemNameById = (list, id, newName) =>
    list.map(item => {
      if (item.id === id) return { ...item, name: newName };
      if (item.type === "folder" && item.children) {
        return { ...item, children: updateItemNameById(item.children, id, newName) };
      }
      return item;
    });

  const extractItem = (list, id) => {
    let found = null;
    const walk = arr => arr.reduce((result, item) => {
      if (item.id === id) {
        found = item;
        return result;
      }
      if (item.type === "folder") {
        const children = walk(item.children || []);
        result.push({ ...item, children });
      } else {
        result.push(item);
      }
      return result;
    }, []);
    return [walk(list), found];
  };

  const insertAtPosition = (list, targetId, insertItem, position) =>
    list.flatMap(item => {
      const before = item.id === targetId && position === "before" ? [insertItem] : [];
      const after = item.id === targetId && position === "after" ? [insertItem] : [];
      const children = item.type === "folder"
        ? { ...item, children: insertAtPosition(item.children || [], targetId, insertItem, position) }
        : item;
      return [...before, children, ...after];
    });

  const insertIntoFolder = (list, folderId, insertItem) =>
    list.map(item => {
      if (item.id === folderId) {
        return { ...item, children: [...(item.children || []), insertItem] };
      }
      if (item.type === "folder") {
        return { ...item, children: insertIntoFolder(item.children || [], folderId, insertItem) };
      }
      return item;
    });

  const flattenItems = (arr, parentId = null) =>
    arr.flatMap(item =>
      item.type === "folder"
        ? [{ ...item, parentId }, ...flattenItems(item.children || [], item.id)]
        : [{ ...item, parentId }]
    );

  const isDescendant = (parent, childId) => {
    if (parent.id === childId) return true;
    return (parent.children || []).some(child =>
      child.id === childId || (child.type === "folder" && isDescendant(child, childId))
    );
  };

  const findItemById = (list, id) => {
    for (const item of list) {
      if (item.id === id) return item;
      if (item.type === "folder") {
        const found = findItemById(item.children || [], id);
        if (found) return found;
      }
    }
    return null;
  };

  const removeItem = (list, id) =>
    list.flatMap(item => {
      if (item.id === id) return [];
      if (item.type === "folder") {
        return [{ ...item, children: removeItem(item.children || [], id) }];
      }
      return [item];
    });

  const handleTemplateSave = () => {
    const name = newTemplateName.trim().slice(0, 30) || "New Template";
    const newTemplate = {
      id: crypto.randomUUID(),
      type: "template",
      name,
      blocks: state.blocks,
      templateHeader: typeof state.templateHeader === "string" ? state.templateHeader : JSON.stringify(state.templateHeader, null, 2),
    };
    saveItems([...items, newTemplate]);
    setNewTemplateName("");
  };

  const handleTemplateDelete = id => {
    const updated = removeItem(items, id);
    saveItems(updated);
    if (renamingId === id) setRenamingId(null);
  };

  const handleDelete = item => item.type === "folder" ? deleteFolderRecursive(item) : handleTemplateDelete(item.id);

  const handleTemplateLoad = template =>
    dispatch({
      type: "REPLACE_BLOCKS",
      value: { blocks: template.blocks, templateHeader: template.templateHeader },
    });

const handleCopyTemplateResult = async (template) => {
  try {
    const base64 = await computeTemplateResult({
      blocks: template.blocks,
      templateHeader:
        typeof template.templateHeader === "string"
          ? template.templateHeader
          : JSON.stringify(template.templateHeader || {}, null, 2),
    });

    await navigator.clipboard.writeText(base64);

    if (TS?.slabs?.sendSlabToHand) {
      TS.slabs.sendSlabToHand(base64);
    }

    showToast(`Result from "${truncate(template.name)}" copied!`);
  } catch (e) {
    console.error("Failed to copy template result:", e);
    showToast("Failed to copy result.");
  }
};

  const handleRenameStart = id => {
    const item = findItemById(items, id);
    if (item) {
      setRenamingId(id);
      setEditingName(item.name);
    }
  };

  const handleRenameSubmit = () => {
    const name = editingName.trim().slice(0, 30);
    if (!name) return setRenamingId(null);
    saveItems(updateItemNameById(items, renamingId, name));
    setRenamingId(null);
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id || over.id === `before-${active.id}` || over.id === `after-${active.id}`) {
      return setActiveId(null);
    }

    let position = over.id.startsWith("before-") ? "before" : over.id.startsWith("after-") ? "after" : "inside";
    const targetId = over.id.replace(/^(before-|after-)/, "");

    const flattened = flattenItems(items);
    const dropTarget = flattened.find(i => i.id === targetId);
    if (!dropTarget) return setActiveId(null);

    if (position === "inside" && dropTarget.type !== "folder") position = "after";

    const [updatedItems, draggedItem] = extractItem(items, active.id);
    if (!draggedItem || (draggedItem.type === "folder" && isDescendant(draggedItem, dropTarget.id))) return setActiveId(null);

    const finalItems =
      position === "inside"
        ? insertIntoFolder(updatedItems, dropTarget.id, draggedItem)
        : insertAtPosition(updatedItems, targetId, draggedItem, position);

    saveItems(finalItems);
    setActiveId(null);
  };

  const handleCopyTemplate = async template => {
    try {
      const base64 = compressToBase64(JSON.stringify({ name: template.name, blocks: template.blocks, templateHeader: template.templateHeader }));
      await navigator.clipboard.writeText(base64);
      showToast(`Template "${truncate(template.name)}" copied!`);
    } catch (e) {
      console.error("Copy failed:", e);
    }
  };

  const handleCopyFolder = async folder => {
    try {
      const base64 = compressToBase64(JSON.stringify(folder));
      await navigator.clipboard.writeText(base64);
      showToast(`Folder "${truncate(folder.name)}" copied!`);
    } catch (e) {
      console.error("Copy failed:", e);
    }
  };

  const handleOverwriteTemplate = id => {
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return alert("Template not found.");

    const updated = [...items];
    updated[index] = {
      ...updated[index],
      blocks: state.blocks,
      templateHeader: typeof state.templateHeader === "string" ? state.templateHeader : JSON.stringify(state.templateHeader, null, 2),
    };

    saveItems(updated);
    showToast(`Template "${truncate(updated[index].name)}" overwritten!`);
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
        return alert("Invalid JSON or compressed data.");
      }
    }

    const existingIds = new Set(items.map(i => i.id));
    const existingNames = new Set(items.map(i => i.name));
    const newTemplates = [];

    const normalizeTemplates = input => {
      const arr = Array.isArray(input) ? input : [input];

      const processItem = item => {
        const id = crypto.randomUUID();
        const base = item.name || (item.type === "folder" ? "Imported Folder" : "Imported Template");
        let name = base;
        let count = 1;
        while (existingNames.has(name)) name = `${base} - copy${count++ > 1 ? ` ${count - 1}` : ""}`;
        existingNames.add(name);

        if (item.type === "folder") {
          return { id, type: "folder", name, children: (item.children || []).map(processItem) };
        }

        if (!item.blocks) return null;

        return {
          id,
          type: "template",
          name,
          blocks: item.blocks,
          templateHeader: typeof item.templateHeader === "string" ? item.templateHeader : JSON.stringify(item.templateHeader || {}, null, 2),
        };
      };

      return arr.map(processItem).filter(Boolean);
    };

    const normalized = normalizeTemplates(parsed);
    if (!normalized.length) return alert("No valid templates found to import.");

    saveItems([...items, ...normalized]);
    setImportInput("");
    showToast(`${normalized.length} template(s) imported!`);
  };

  const handleSortTemplates = () => {
    const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));
    saveItems(sorted);
    showToast("Templates sorted A → Z");
  };

  const handleSortFolder = (folderId) => {
    const sortRecursively = (list) =>
      list.map(item => {
        if (item.type === "folder") {
          const children = sortRecursively(item.children || []);
          return { ...item, children: [...children].sort((a, b) => a.name.localeCompare(b.name)) };
        }
        return item;
      });

    const updateFolder = (list) =>
      list.map(item => {
        if (item.id === folderId && item.type === "folder") {
          const sortedChildren = [...(item.children || [])].sort((a, b) => a.name.localeCompare(b.name));
          return { ...item, children: sortedChildren };
        } else if (item.type === "folder") {
          return { ...item, children: updateFolder(item.children || []) };
        }
        return item;
      });

    const newItems = updateFolder(items);
    saveItems(newItems);
    showToast("Folder sorted A → Z");
  };

  const handleFolderCreate = () => {
    const base = "New Folder";
    let name = base;
    let count = 1;
    const existing = new Set(items.map(i => i.name));
    while (existing.has(name)) name = `${base} ${count++}`;

    const folder = { id: crypto.randomUUID(), type: "folder", name, children: [] };
    saveItems([...items, folder]);
  };

  const deleteFolderRecursive = folder => {
    const collectIds = f => [f.id, ...(f.children || []).flatMap(c => c.type === "folder" ? collectIds(c) : [c.id])];
    const ids = new Set(collectIds(folder));

    const removeByIds = list =>
      list.filter(item => !ids.has(item.id)).map(item =>
        item.type === "folder" ? { ...item, children: removeByIds(item.children || []) } : item
      );

    saveItems(removeByIds(items));
  };

  const handleDropOutside = draggedId => {
    const draggedItem = findItemById(items, draggedId);
    if (!draggedItem) return;

    const updated = removeItem(items, draggedId);
    saveItems([...updated, draggedItem]);
  };

  return {
    activeId,
    renamingId,
    editingName,
    newTemplateName,
    importInput,
    renameInputRef,
    toastMessage,
    dragOverlayLabel,
    saveItems,
    setActiveId,
    setEditingName,
    setNewTemplateName,
    setImportInput,
    handleTemplateSave,
    handleTemplateDelete,
    handleDelete,
    handleTemplateLoad,
    handleCopyTemplateResult,
    handleRenameStart,
    handleRenameSubmit,
    handleDragEnd,
    handleCopyTemplate,
    handleCopyFolder,
    handleOverwriteTemplate,
    handleCopyAllTemplates,
    handleImportTemplate,
    handleSortTemplates,
    handleSortFolder,
    handleFolderCreate,
    deleteFolderRecursive,
    handleDropOutside,
    setDragOverlayLabel,
  };
}
