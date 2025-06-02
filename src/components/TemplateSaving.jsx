import { useEffect, useState, useRef } from "react";
import { useTrackedState, useUpdate } from './StateProvider';

export default function TemplateSaving() {
  const [templates, setTemplates] = useState([]);
  const [renaming, setRenaming] = useState(null);
  const [renamePosition, setRenamePosition] = useState({ top: 0, left: 0 });
  const [templateName, setTemplateName] = useState("");
  const [newTemplateName, setNewTemplateName] = useState("");
  const renameBoxRef = useRef(null);
  const renameInputRef = useRef(null);

  const state = useTrackedState();
  const dispatch = useUpdate();

  function handleInputChange(event) {
    dispatch({
      type: 'REPLACE_BLOCKS',
      value: event.currentTarget.value,
    });
  }

  function handleTemplateSave() {
    const nameToSave = newTemplateName.trim() || new Date().getTime();
    const newTemplates = [
      ...templates,
      {
        name: nameToSave,
        blocks: state.blocks,
        templateHeader: state.templateHeader,
      }
    ];
    setTemplates(newTemplates);
    TS.localStorage.global.setBlob(JSON.stringify(newTemplates));
    setNewTemplateName("");
  }

  function handleTemplateDelete(event) {
    const template = templates[event.currentTarget.closest('.template-item').dataset['index']];
    const newTemplates = templates.filter(e => e.name !== template.name);
    setTemplates(newTemplates);
    TS.localStorage.global.setBlob(JSON.stringify(newTemplates));
  }

  function handleTemplateLoad(event) {
    const template = templates[event.currentTarget.closest('.template-item').dataset['index']];
    dispatch({
      type: 'REPLACE_BLOCKS',
      value: JSON.stringify({
        blocks: template.blocks,
        templateHeader: template.templateHeader,
      }),
    });
  }

  function handleTemplateRenameButton(event) {
    const index = event.currentTarget.closest('.template-item').dataset['index'];
    setRenaming(index);
    setTemplateName(templates[index].name);

    const rect = event.currentTarget.getBoundingClientRect();
    const buffer = 40;
    const boxWidth = 600;
    const boxHeight = 60;

    const left = Math.max(rect.left - boxWidth - buffer, 10);
    const top = Math.min(rect.top, window.innerHeight - boxHeight);

    setRenamePosition({ top, left });
  }

  function handleTemplateRenameSubmit(event) {
    event.preventDefault();
    const input = event.currentTarget.querySelector('input');
    const newTemplates = JSON.parse(JSON.stringify(templates));
    newTemplates[renaming].name = input.value;
    setTemplates(newTemplates);
    TS.localStorage.global.setBlob(JSON.stringify(newTemplates));
    setRenaming(null);
  }

  useEffect(() => {
    (async () => {
      const savedTemplates = JSON.parse(await TS.localStorage.global.getBlob() || '[]');
      setTemplates(savedTemplates);
    })();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        renameBoxRef.current &&
        !renameBoxRef.current.contains(event.target)
      ) {
        setRenaming(null);
      }
    }

    if (renaming !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [renaming]);

  useEffect(() => {
    if (renaming !== null && renameInputRef.current) {
      renameInputRef.current.focus();
    }
  }, [renaming]);

  return (
    <div className="TemplateSaving block--results">
      <div className="BlockHeader">
        <div className="block__title-bar">
          <div className="block__title">templates</div>
        </div>
      </div>

      {renaming !== null && (
        <div className="TemplateSaving__rename__blur">
          <div
            className="TemplateSaving__rename"
            ref={renameBoxRef}
            style={{
              top: `${renamePosition.top}px`,
              left: `${renamePosition.left}px`,
              position: 'fixed',
            }}
          >
            <form onSubmit={handleTemplateRenameSubmit}>
              <input
                ref={renameInputRef}
                type="text"
                value={templateName}
                onChange={(event) => setTemplateName(event.currentTarget.value)}
              />
            </form>
          </div>
        </div>
      )}

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

      {templates.map((template, index) => (
        <div className="template-item" key={index} data-index={index}>
          <button className="template-name" onClick={handleTemplateLoad}>
            {template.name}
          </button>
          <button onClick={handleTemplateRenameButton}>rename</button>
          <button onClick={handleTemplateDelete}>x</button>
        </div>
      ))}

      <textarea
        value={JSON.stringify({
          templateHeader: state.templateHeader,
          blocks: state.blocks,
        })}
        onChange={handleInputChange}
        spellCheck={false}
      />
    </div>
  );
}
