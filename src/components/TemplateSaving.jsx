import { useEffect, useState } from "react";
import { useTrackedState, useUpdate } from "./StateProvider";
import TemplateInputBar from "./TemplateInputBar";
import TemplateList from "./TemplateList";
import TemplateImportExport from "./TemplateImportExport";
import TemplateDndContext from "./TemplateDndContext";
import useTemplateActions from "../lib/useTemplateActions";

export default function TemplateSaving() {
  const [items, setItems] = useState([]);
  const [collapsed, setCollapsed] = useState(new Set());
  const state = useTrackedState();
  const dispatch = useUpdate();

  useEffect(() => {
    (async () => {
      const savedRaw = await TS.localStorage.global.getBlob();
      if (!savedRaw) return;

      try {
        const saved = JSON.parse(savedRaw);

        // Support legacy format (plain array) or new object
        if (Array.isArray(saved)) {
          setItems(saved);
        } else {
          setItems(saved.items || []);
          setCollapsed(new Set(saved.collapsed || []));
        }
      } catch (e) {
        console.error("Failed to parse saved templates:", e);
        setItems([]);
      }
    })();
  }, []);

  const actions = useTemplateActions(items, setItems, state, dispatch, collapsed);

  return (
    <div className="TemplateSaving block--results">
      <div className="BlockHeader">
        <div className="block__title-bar">
          <div className="block__title">templates</div>
        </div>
      </div>

      <TemplateInputBar
        newTemplateName={actions.newTemplateName}
        setNewTemplateName={actions.setNewTemplateName}
        onSave={actions.handleTemplateSave}
      />

      <TemplateDndContext
        items={items}
        activeId={actions.activeId}
        setActiveId={actions.setActiveId}
        onDragEnd={actions.handleDragEnd}
        overlayContent={actions.dragOverlayLabel}
        setDragOverlayLabel={actions.setDragOverlayLabel}
      >
        <TemplateList
          items={items}
          renamingId={actions.renamingId}
          editingName={actions.editingName}
          renameInputRef={actions.renameInputRef}
          onRenameStart={actions.handleRenameStart}
          onRenameSubmit={actions.handleRenameSubmit}
          onChangeName={actions.setEditingName}
          onLoad={actions.handleTemplateLoad}
          onCopyResult={actions.handleCopyTemplateResult}
          onDelete={actions.handleDelete}
          onCopy={actions.handleCopyTemplate}
          onCopyFolder={actions.handleCopyFolder}
          onOverwrite={actions.handleOverwriteTemplate}
          collapsedFolders={collapsed}
          setCollapsedFolders={setCollapsed}
          onCollapseChange={(collapsedIds) => {
            actions.saveItems(items, collapsedIds); // Persist collapsed state
          }}
          onSortFolder={actions.handleSortFolder}
        />
      </TemplateDndContext>

      <TemplateImportExport
        importInput={actions.importInput}
        setImportInput={actions.setImportInput}
        onImport={actions.handleImportTemplate}
        onCopyAll={actions.handleCopyAllTemplates}
        onSort={actions.handleSortTemplates}
        onCreateFolder={actions.handleFolderCreate}
      />

      {actions.toastMessage && <div className="toast">{actions.toastMessage}</div>}
    </div>
  );
}
