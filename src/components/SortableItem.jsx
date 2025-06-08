import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableItem({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="sortable-item"
    >
      <div
        ref={setActivatorNodeRef}
        {...listeners}
        {...attributes}
        className="drag-handle"
      >
        ☰
      </div>
      <div className="sortable-content">{children}</div>
    </div>
  );
}
