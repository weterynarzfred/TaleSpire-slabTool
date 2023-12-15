import { useTrackedState, useUpdate } from './StateProvider';

export default function TemplateSaving() {
  const state = useTrackedState();
  const dispatch = useUpdate();

  function handleInputChange(event) {
    dispatch({
      type: 'REPLACE_BLOCKS',
      value: event.currentTarget.value,
    });
  }

  return <div className="TemplateSaving">
    <p><strong>current template</strong> (temporary fix) – copy and paste only, don't edit by hand or you might crash the symbiote:</p>
    <textarea value={JSON.stringify(state.blocks)} onChange={handleInputChange} spellCheck={false} />
  </div>;
}
