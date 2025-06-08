import SortableItem from "./SortableItem";
import { truncate } from "../lib/templateUtils";
import { Pencil, RotateCcw, Copy as CopyIcon, CircleX } from "lucide-react";

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
  onOverwrite,
}) {
  return items.map((item) => (
    <SortableItem key={item.id} id={item.id}>
      <div className="template-item">
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
        ) : (
          <>
            <button
              className="template-name"
              onClick={() => onLoad(item)}
              title={item.name}
            >
              {truncate(item.name)}
            </button>
            <button
              onClick={() => onRenameStart(item.id)}
              title="Rename"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => onCopy(item)}
              title="Copy"
            >
              <CopyIcon size={15} />
            </button>
            <button
              onClick={() => onOverwrite(item.id)}
              title="Replace"
            >
              <RotateCcw size={15} />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              title="Delete"
            >
              <CircleX size={15} />
            </button>
          </>
        )}
      </div>
    </SortableItem>
  ));
}
