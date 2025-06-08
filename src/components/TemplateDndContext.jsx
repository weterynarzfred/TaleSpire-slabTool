import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export default function TemplateDndContext({
  items,
  activeId,
  setActiveId,
  onDragEnd,
  children,
  overlayContent,
}) {
  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      onDragStart={({ active }) => setActiveId(active.id)}
    >
      <SortableContext items={items.map(({ id }) => id)} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
      <DragOverlay>
        {activeId ? (
          <div className="template-item drag-overlay">{overlayContent}</div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
