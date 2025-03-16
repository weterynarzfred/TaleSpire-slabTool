import { useEffect, useState } from "react";
import { useTrackedState, useUpdate } from './StateProvider';

export default function TemplateSaving() {
  const [templates, setTemplates] = useState([]);
  const [renaming, setRenaming] = useState(null);
  const [templateName, setTemplateName] = useState("");
  const state = useTrackedState();
  const dispatch = useUpdate();

  function handleInputChange(event) {
    dispatch({
      type: 'REPLACE_BLOCKS',
      value: event.currentTarget.value,
    });
  }

  function handleTemplateSave() {
    const newTemplates = [
      ...templates,
      {
        name: new Date().getTime(),
        blocks: state.blocks,
      }
    ];
    setTemplates(newTemplates);
    TS.localStorage.global.setBlob(JSON.stringify(newTemplates));
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
      value: JSON.stringify(template.blocks),
    });
  }

  function handleTemplateRenameButton(event) {
    const index = event.currentTarget.closest('.template-item').dataset['index'];
    setRenaming(index);
    setTemplateName(templates[index].name);
  }

  function handleTemplateRenameSubmit(event) {
    event.preventDefault();
    const input = event.currentTarget.querySelector('input');
    console.log(input.value);
    const newTemplates = JSON.parse(JSON.stringify(templates));
    newTemplates[renaming].name = input.value;
    setTemplates(newTemplates);
    TS.localStorage.global.setBlob(JSON.stringify(newTemplates));
    setRenaming(null);
  }

  useEffect(() => {
    (async () => {
      const savedTemplates = JSON.parse(await TS.localStorage.global.getBlob() || '[]');
      console.log(savedTemplates);
      setTemplates(savedTemplates);
    })();
  }, []);

  return <div className="TemplateSaving">
    {renaming === null ? null : <div className="TempalteSaving__rename">
      <form onSubmit={handleTemplateRenameSubmit}>
        <input type="text" value={templateName} onChange={event => { setTemplateName(event.currentTarget.value); }} />
      </form>
    </div>}
    <button onClick={handleTemplateSave}>save current template</button>
    {templates.map((template, index) => <div className="template-item" key={index} data-index={index}>
      <div onClick={handleTemplateLoad}>{template.name}</div>
      <button onClick={handleTemplateRenameButton}>rename</button>
      <button onClick={handleTemplateDelete}>×</button>
    </div>)}
    <textarea value={JSON.stringify(state.blocks)} onChange={handleInputChange} spellCheck={false} />
  </div>;
}
