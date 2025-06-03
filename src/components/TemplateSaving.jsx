import { useEffect, useState, useRef } from "react";
import { useTrackedState, useUpdate } from './StateProvider';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="sortable-item">
      <div
        ref={setActivatorNodeRef}
        {...listeners}
        {...attributes}
        className="drag-handle"
        style={{ cursor: 'grab', paddingRight: 8 }}
      >
        ☰
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

export default function TemplateSaving() {
  const [items, setItems] = useState([]); // folders and templates
  const [activeId, setActiveId] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [renaming, setRenaming] = useState(null); // id of item being renamed
  const [editingName, setEditingName] = useState("");
  const [newTemplateName, setNewTemplateName] = useState("");
  const state = useTrackedState();
  const dispatch = useUpdate();

  const renameInputRef = useRef(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const saveItems = (updated) => {
    setItems(updated);
    TS.localStorage.global.setBlob(JSON.stringify(updated));
  };

  const handleInputChange = (e) => {
    dispatch({ type: 'REPLACE_BLOCKS', value: e.currentTarget.value });
  };

  const handleTemplateSave = () => {
    const name = newTemplateName.trim() || `${Date.now()}`;
    const updated = [...items, {
      id: crypto.randomUUID(),
      type: 'template',
      name,
      blocks: state.blocks,
      templateHeader: state.templateHeader,
    }];
    saveItems(updated);
    setNewTemplateName("");
  };

  const handleTemplateDelete = (id) => {
    const updated = items.filter(item => item.id !== id);
    saveItems(updated);
  };

  const handleTemplateLoad = (template) => {
    dispatch({
      type: 'REPLACE_BLOCKS',
      value: JSON.stringify({ blocks: template.blocks, templateHeader: template.templateHeader })
    });
  };

  const handleTemplateRenameButton = (id) => {
    setRenaming(id);
    const item = items.find(i => i.id === id);
    setEditingName(item ? item.name : "");
  };

  const handleRenameSubmit = () => {
    if (!renaming) return;
    const updated = items.map(item =>
      item.id === renaming ? { ...item, name: editingName.trim() || item.name } : item
    );
    saveItems(updated);
    setRenaming(null);
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;
    const oldIndex = items.findIndex(item => item.id === active.id);
    const newIndex = items.findIndex(item => item.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      const updated = arrayMove(items, oldIndex, newIndex);
      saveItems(updated);
    }
    setActiveId(null);
  };

  const toggleFolder = (id) => {
    const updated = new Set(expandedFolders);
    updated.has(id) ? updated.delete(id) : updated.add(id);
    setExpandedFolders(updated);
  };

  useEffect(() => {
    (async () => {
      const saved = JSON.parse(await TS.localStorage.global.getBlob() || '[]');
      setItems(saved);
    })();
  }, []);

  // Focus and select text when entering rename mode
  useEffect(() => {
    if (renaming && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renaming]);

  const renderItems = (items) => (
    <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
      {items.map((item) => (
        <SortableItem key={item.id} id={item.id}>
          <div className="template-item">
            {item.type === 'folder' ? (
              <>
                <div onClick={() => toggleFolder(item.id)} style={{ cursor: 'pointer' }}>
                  ► {item.name}
                </div>
                {expandedFolders.has(item.id) && (
                  <div className="folder-contents" style={{ paddingLeft: '1em' }}>
                    {renderItems(item.children || [])}
                  </div>
                )}
              </>
            ) : (
              <>
                {renaming === item.id ? (
                  <input
                    ref={renameInputRef}
                    className="template-name-input"
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={handleRenameSubmit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleRenameSubmit();
                      }
                      if (e.key === 'Escape') {
                        setRenaming(null);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <button className="template-name" onClick={() => handleTemplateLoad(item)}>
                    {item.name}
                  </button>
                )}
                <button onClick={() => handleTemplateRenameButton(item.id)}>rename</button>
                <button onClick={() => handleTemplateDelete(item.id)}>x</button>
              </>
            )}
          </div>
        </SortableItem>
      ))}
    </SortableContext>
  );

  return (
    <div className="TemplateSaving block--results">
      <div className="BlockHeader">
        <div className="block__title-bar">
          <div className="block__title">templates</div>
        </div>
      </div>

      <div className="template-save-wrapper">
        <div className="template-save-name">
          <input
            type="text"
            placeholder="Template Name"
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
          />
        </div>
        <button className="template-save" onClick={handleTemplateSave}>
          save current template
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={({ active }) => setActiveId(active.id)}
      >
        {renderItems(items)}
        <DragOverlay>
          {activeId ? <div className="template-item drag-overlay">Dragging...</div> : null}
        </DragOverlay>
      </DndContext>

      <textarea
        value={JSON.stringify({ templateHeader: state.templateHeader, blocks: state.blocks }, null, 2)}
        onChange={handleInputChange}
        spellCheck={false}
      />
    </div>
  );
}
