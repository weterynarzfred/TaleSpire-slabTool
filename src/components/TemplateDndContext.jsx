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
import { Folder } from "lucide-react";

export default function TemplateDndContext({
  items,
  activeId,
  setActiveId,
  setDragOverlayLabel,
  onDragEnd,
  children,
  overlayContent,
}) {
  const sensors = useSensors(useSensor(PointerSensor));

  const findItemById = (list, id) => {
    for (const item of list) {
      if (item.id === id) return item;
      if (item.type === "folder" && item.children) {
        const result = findItemById(item.children, id);
        if (result) return result;
      }
    }
    return null;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(event) => {
        setActiveId(null); // always reset after drag
        onDragEnd(event);
      }}
      onDragStart={({ active }) => {
        setActiveId(active.id);
        const item = findItemById(items, active.id);
        setDragOverlayLabel?.(item?.name || "Dragging...");
      }}
    >
      <SortableContext
        items={items.map(({ id }) => id)}
        strategy={verticalListSortingStrategy}
      >
        {children}
      </SortableContext>

      <DragOverlay dropAnimation={null}>
        {activeId ? (
          (() => {
            const item = findItemById(items, activeId);
            return (
              <div className="template-item drag-overlay">
                {item?.type === "folder" && (
                  <Folder size={14} className="drag-overlay-icon" />
                )}
                <span>{overlayContent}</span>
              </div>
            );
          })()
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
