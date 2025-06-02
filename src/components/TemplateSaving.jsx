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
        templateHeader: state.templateHeader,
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
      setTemplates(savedTemplates);
    })();
  }, []);

  return <div className="TemplateSaving block--results">
    <div className="BlockHeader">
      <div className="block__title-bar">
        <div className="block__title">templates</div>
      </div>
    </div>

    {renaming === null ? null : <div className="TemplateSaving__rename__blur">
      <div className="TemplateSaving__rename">
        <form onSubmit={handleTemplateRenameSubmit}>
          <input type="text" value={templateName} onChange={event => { setTemplateName(event.currentTarget.value); }} />
        </form>
      </div>
    </div>}

    <div className="template-save-wrapper">
      <div className="template-save-name">
        <textarea placeholder="Template Name" />
      </div>
      <button className="template-save" onClick={handleTemplateSave}>save current template</button>
    </div>
    {templates.map((template, index) => <div className="template-item" key={index} data-index={index}>
      <button className="template-name" onClick={handleTemplateLoad}>{template.name}</button>
      <button onClick={handleTemplateRenameButton}>rename</button>
      <button onClick={handleTemplateDelete}>x</button>

    </div>)}
    <textarea value={JSON.stringify({
      templateHeader: state.templateHeader,
      blocks: state.blocks
    })} onChange={handleInputChange} spellCheck={false} />
  </div>;
}
