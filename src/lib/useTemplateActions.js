import { useState, useRef } from "react";
import { compressToBase64, decompressFromBase64, truncate } from "../lib/templateUtils";
import useToast from "../lib/useToast";
import { arrayMove } from "@dnd-kit/sortable";

export default function useTemplateActions(items, setItems, state, dispatch) {
  const [activeId, setActiveId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [newTemplateName, setNewTemplateName] = useState("");
  const [importInput, setImportInput] = useState("");
  const renameInputRef = useRef(null);
  const [toastMessage, showToast] = useToast();
  const [dragOverlayLabel, setDragOverlayLabel] = useState("");

  const saveItems = (updatedItems, collapsedIds = null) => {
    setItems(updatedItems);
    TS.localStorage.global.setBlob(
      JSON.stringify({
        items: updatedItems,
        collapsed: collapsedIds ?? [],
      })
    );
  };

  const handleTemplateSave = () => {
    const baseName = newTemplateName.trim().slice(0, 30) || "New Template";
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
    const removeById = (list, id) =>
      list
        .filter((item) => item.id !== id)
        .map((item) =>
          item.type === "folder"
            ? { ...item, children: removeById(item.children || [], id) }
            : item
        );

    const updated = removeById(items, id);
    saveItems(updated);

    if (renamingId === id) setRenamingId(null);
  };

  const handleDelete = (item) => {
    if (item.type === "folder") {
      deleteFolderRecursive(item);
    } else {
      handleTemplateDelete(item.id);
    }
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
    const trimmed = editingName.trim().slice(0, 30);
    if (!trimmed) {
      setRenamingId(null);
      return;
    }

    function updateItemNameById(list, id, newName) {
      return list.map(item => {
        if (item.id === id) {
          return { ...item, name: newName };
        }
        if (item.type === "folder" && item.children) {
          return {
            ...item,
            children: updateItemNameById(item.children, id, newName)
          };
        }
        return item;
      });
    }

    const updated = updateItemNameById(items, renamingId, trimmed);
    saveItems(updated);
    setRenamingId(null);
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return setActiveId(null);

    // Prevent dropping onto your own before/after zones
    if (
      over.id === `before-${active.id}` ||
      over.id === `after-${active.id}`
    ) {
      return setActiveId(null);
    }

    // Determine drop position and targetId
    let position = "inside";
    let targetId = over.id;

    if (targetId.startsWith("before-")) {
      position = "before";
      targetId = targetId.replace("before-", "");
    } else if (targetId.startsWith("after-")) {
      position = "after";
      targetId = targetId.replace("after-", "");
    }

    // Flatten tree for easy lookup
    const flattenItems = (arr, parentId = null) =>
      arr.flatMap((item) => {
        if (item.type === "folder") {
          return [
            { ...item, parentId },
            ...flattenItems(item.children || [], item.id),
          ];
        }
        return { ...item, parentId };
      });

    const flattened = flattenItems(items);
    const dropTarget = flattened.find((i) => i.id === targetId);
    if (!dropTarget) return setActiveId(null);

    // Fallback: templates can't receive 'inside' drops
    if (position === "inside" && dropTarget.type !== "folder") {
      position = "after";
    }

    // Remove dragged item and retrieve it
    const extractItem = (list, id) => {
      let found = null;
      const walk = (arr) => {
        const result = [];
        for (let item of arr) {
          if (item.id === id) {
            found = item;
            continue;
          }
          if (item.type === "folder") {
            const children = walk(item.children || []);
            result.push({ ...item, children });
          } else {
            result.push(item);
          }
        }
        return result;
      };
      const newList = walk(list);
      return [newList, found];
    };

    const [updatedItems, draggedItem] = extractItem(items, active.id);
    if (!draggedItem) return setActiveId(null);

    // Prevent folder from being dropped into its own descendant
    const isDescendant = (parent, childId) => {
      if (parent.id === childId) return true;
      if (!parent.children) return false;
      return parent.children.some((child) =>
        child.id === childId ||
        (child.type === "folder" && isDescendant(child, childId))
      );
    };

    if (
      draggedItem.type === "folder" &&
      isDescendant(draggedItem, dropTarget.id)
    ) {
      return setActiveId(null); // prevent circular nesting
    }

    // Insert item at appropriate position
    const insertAtPosition = (list, targetId, insertItem, position) => {
      const result = [];
      for (let item of list) {
        if (item.id === targetId && position === "before") {
          result.push(insertItem);
        }

        if (item.type === "folder") {
          result.push({
            ...item,
            children: insertAtPosition(
              item.children || [],
              targetId,
              insertItem,
              position
            ),
          });
        } else {
          result.push(item);
        }

        if (item.id === targetId && position === "after") {
          result.push(insertItem);
        }
      }
      return result;
    };

    let finalItems;

    if (position === "inside" && dropTarget.type === "folder") {
      const insertIntoFolder = (list) =>
        list.map((item) => {
          if (item.id === dropTarget.id) {
            return {
              ...item,
              children: [...(item.children || []), draggedItem],
            };
          }
          if (item.type === "folder") {
            return {
              ...item,
              children: insertIntoFolder(item.children || []),
            };
          }
          return item;
        });

      finalItems = insertIntoFolder(updatedItems);
    } else {
      finalItems = insertAtPosition(
        updatedItems,
        targetId,
        draggedItem,
        position
      );
    }

    saveItems(finalItems);
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

  const handleCopyFolder = async (folder) => {
    try {
      const base64 = compressToBase64(JSON.stringify(folder));
      await navigator.clipboard.writeText(base64);
      showToast(`Folder "${truncate(folder.name)}" copied!`);
    } catch (e) {
      console.error("Copy failed:", e);
    }
  };

  const handleOverwriteTemplate = (id) => {
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) {
      alert("Template not found.");
      return;
    }

    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      blocks: state.blocks,
      templateHeader: typeof state.templateHeader === "string"
        ? state.templateHeader
        : JSON.stringify(state.templateHeader, null, 2),
    };

    saveItems(updatedItems);
    showToast(`Template "${truncate(updatedItems[index].name)}" overwritten!`);
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

      const processItem = (item) => {
        const newId = crypto.randomUUID();
        const getUniqueName = (base) => {
          let finalName = base;
          let counter = 1;
          while (existingNames.has(finalName)) {
            finalName = `${base} - copy${counter > 1 ? ` ${counter}` : ""}`;
            counter++;
          }
          existingNames.add(finalName);
          return finalName;
        };

        if (item.type === "folder") {
          return {
            id: newId,
            type: "folder",
            name: getUniqueName(item.name || "Imported Folder"),
            children: (item.children || []).map(processItem),
          };
        }

        if (!item.blocks) return null;

        return {
          id: newId,
          type: "template",
          name: getUniqueName(item.name || "Imported Template"),
          blocks: item.blocks,
          templateHeader:
            typeof item.templateHeader === "string"
              ? item.templateHeader
              : JSON.stringify(item.templateHeader || {}, null, 2),
        };
      };

      const final = arr.map(processItem).filter(Boolean);
      newTemplates.push(...final);
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

  const handleFolderCreate = () => {
    const baseName = "New Folder";
    let name = baseName;
    let count = 1;

    const existingNames = new Set(items.map(i => i.name));
    while (existingNames.has(name)) {
      name = `${baseName} ${count++}`;
    }

    const folder = {
      id: crypto.randomUUID(),
      type: "folder",
      name,
      children: [],
    };

    saveItems([...items, folder]);
  };

  const deleteFolderRecursive = (folder) => {
    if (!folder || folder.type !== "folder") return;

    const collectIds = (folder) => {
      const ids = [folder.id];
      (folder.children || []).forEach((child) => {
        if (child.type === "folder") {
          ids.push(...collectIds(child));
        } else {
          ids.push(child.id);
        }
      });
      return ids;
    };

    const idsToDelete = new Set(collectIds(folder));

    const removeByIds = (list) =>
      list
        .filter((item) => !idsToDelete.has(item.id))
        .map((item) =>
          item.type === "folder"
            ? { ...item, children: removeByIds(item.children || []) }
            : item
        );

    saveItems(removeByIds(items));
  };

  function handleDropOutside(draggedId) {
    const removeItem = (list, id) =>
      list.flatMap((item) => {
        if (item.type === "folder") {
          return [{
            ...item,
            children: removeItem(item.children || [], id)
          }];
        }
        return item.id === id ? [] : [item];
      });

    const draggedItem = findItemById(items, draggedId);
    if (!draggedItem) return;

    const updated = removeItem(items, draggedId);
    saveItems([...updated, draggedItem]);
  }

  function findItemById(list, id) {
    for (const item of list) {
      if (item.id === id) return item;
      if (item.type === "folder" && item.children) {
        const found = findItemById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  }

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
    handleRenameStart,
    handleRenameSubmit,
    handleDragEnd,
    handleCopyTemplate,
    handleCopyFolder,
    handleOverwriteTemplate,
    handleCopyAllTemplates,
    handleImportTemplate,
    handleSortTemplates,
    handleFolderCreate,
    deleteFolderRecursive,
    handleDropOutside,
    setDragOverlayLabel,
  };
}
