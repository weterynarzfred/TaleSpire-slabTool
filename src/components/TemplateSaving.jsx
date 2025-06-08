import { useEffect, useState } from "react";
import { useTrackedState, useUpdate } from "./StateProvider";
import TemplateInputBar from "./TemplateInputBar";
import TemplateList from "./TemplateList";
import TemplateImportExport from "./TemplateImportExport";
import TemplateDndContext from "./TemplateDndContext";
import useTemplateActions from "../lib/useTemplateActions";

export default function TemplateSaving() {
  const [items, setItems] = useState([]);
  const state = useTrackedState();
  const dispatch = useUpdate();

  useEffect(() => {
    (async () => {
      const saved = JSON.parse((await TS.localStorage.global.getBlob()) || "[]");
      setItems(saved);
    })();
  }, []);

  const actions = useTemplateActions(items, setItems, state, dispatch);

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
        overlayContent={items.find((i) => i.id === actions.activeId)?.name || "Dragging..."}
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
          onDelete={actions.handleTemplateDelete}
          onCopy={actions.handleCopyTemplate}
          onOverwrite={actions.handleOverwriteTemplate}
        />
      </TemplateDndContext>

      <TemplateImportExport
        importInput={actions.importInput}
        setImportInput={actions.setImportInput}
        onImport={actions.handleImportTemplate}
        onCopyAll={actions.handleCopyAllTemplates}
        onSort={actions.handleSortTemplates}
      />

      {actions.toastMessage && <div className="toast">{actions.toastMessage}</div>}
    </div>
  );
}
