import SortableItem from "./SortableItem";

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
            <button className="template-name" onClick={() => onLoad(item)} title="Load Template">
              {item.name}
            </button>
            <button onClick={() => onRenameStart(item.id)}>rename</button>
            <button onClick={() => onCopy(item)}>copy</button>
            <button onClick={() => onDelete(item.id)}>x</button>
          </>
        )}
      </div>
    </SortableItem>
  ));
}
