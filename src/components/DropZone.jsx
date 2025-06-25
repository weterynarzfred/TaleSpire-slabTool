import { useDroppable } from "@dnd-kit/core";

export default function DropZone({ id, onDrop, isOver }) {
  const { setNodeRef, isOver: isDropping } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`drop-zone${isDropping || isOver ? " drop-zone--active" : ""}`}
      onClick={() => typeof onDrop === "function" && onDrop(id)}
    />
  );
}
