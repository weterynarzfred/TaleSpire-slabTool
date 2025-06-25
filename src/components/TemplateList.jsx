import { useEffect } from "react";
import SortableItem from "./SortableItem";
import DropZone from "./DropZone";
import { useDroppable } from "@dnd-kit/core";
import { truncate } from "../lib/templateUtils";
import {
  Pencil,
  RotateCcw,
  Copy as CopyIcon,
  CircleX,
  Folder,
} from "lucide-react";

function FolderDropTarget({ id, children }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={`folder-target ${isOver ? "highlight" : ""}`}>
      {children}
    </div>
  );
}

export default function TemplateList({
  items,
  renamingId,
  editingName,
  renameInputRef,
  onRenameStart,
  onRenameSubmit,
  onChangeName,
  onLoad,
  onDelete,
  onCopy,
  onCopyFolder,
  onOverwrite,
  onDropOutside,
  collapsedFolders,
  setCollapsedFolders,
  onCollapseChange,
}) {
  const isCollapsed = (id) => collapsedFolders.has(id);

  const toggleCollapse = (id) => {
    setCollapsedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      onCollapseChange?.(Array.from(next));
      return next;
    });
  };

  const renderItems = (list, level = 0) =>
    list.map((item) => {
      const isFolder = item.type === "folder";
      const indentStyle = { marginLeft: `${level * 20}px` };

      return (
        <div key={item.id}>
          <DropZone id={`before-${item.id}`} onDrop={(id) => onDropOutside?.(id)} />

          <SortableItem id={item.id}>
            <FolderDropTarget id={item.id}>
              <div
                className={`template-item ${isFolder ? "template-folder" : ""}`}
                style={indentStyle}
              >
                {renamingId === item.id ? (
                  <input
                    ref={renameInputRef}
                    className="template-name-input"
                    type="text"
                    spellCheck={false}
                    maxLength={30}
                    value={editingName}
                    onChange={(e) => onChangeName(e.target.value)}
                    onBlur={onRenameSubmit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        onRenameSubmit();
                      }
                      if (e.key === "Escape") onRenameSubmit(null);
                    }}
                    autoFocus
                  />
                ) : isFolder ? (
                  <>
                    <button
                      className="folder-name"
                      onClick={() => toggleCollapse(item.id)}
                      title="Toggle Folder"
                    >
                      <span className="folder-name-inner">
                        <Folder size={15} className="folder-icon" />
                        <span
                          className={`folder-toggle-symbol ${isCollapsed(item.id) ? "collapsed" : "expanded"
                            }`}
                        >
                          ▶
                        </span>
                        {truncate(item.name)}
                      </span>
                    </button>
                    <button
                      className="default-tooltip-anchor"
                      data-tooltip-key="folderRename"
                      onClick={() => onRenameStart(item.id)}
                      title="Rename Folder"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      className="default-tooltip-anchor"
                      data-tooltip-key="folderCopy"
                      onClick={() => onCopyFolder(item)}
                      title="Copy Folder and Contents"
                    >
                      <CopyIcon size={15} />
                    </button>
                    <button
                      className="default-tooltip-anchor"
                      data-tooltip-key="folderDelete"
                      onClick={() => onDelete(item)}
                      title="Delete Folder and Contents"
                    >
                      <CircleX size={15} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="template-name default-tooltip-anchor"
                      data-tooltip-key="templateLoad"
                      onClick={() => onLoad(item)}
                      title={item.name}
                    >
                      {truncate(item.name)}
                    </button>
                    <button
                      className="default-tooltip-anchor"
                      data-tooltip-key="templateRename"
                      onClick={() => onRenameStart(item.id)}
                      title="Rename"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      className="default-tooltip-anchor"
                      data-tooltip-key="templateCopy"
                      onClick={() => onCopy(item)}
                      title="Copy"
                    >
                      <CopyIcon size={15} />
                    </button>
                    <button
                      className="default-tooltip-anchor"
                      data-tooltip-key="templateReplace"
                      onClick={() => onOverwrite(item.id)}
                      title="Replace"
                    >
                      <RotateCcw size={15} />
                    </button>
                    <button
                      className="default-tooltip-anchor"
                      data-tooltip-key="templateDelete"
                      onClick={() => onDelete(item)}
                      title="Delete"
                    >
                      <CircleX size={15} />
                    </button>
                  </>
                )}
              </div>
            </FolderDropTarget>
          </SortableItem>

          {isFolder &&
            !isCollapsed(item.id) &&
            item.children?.length > 0 &&
            renderItems(item.children, level + 1)}

          <DropZone id={`after-${item.id}`} onDrop={(id) => onDropOutside?.(id)} />
        </div>
      );
    });

  return <>{renderItems(items)}</>;
}
