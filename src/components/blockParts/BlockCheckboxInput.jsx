import { useTrackedState, useUpdate } from '../StateProvider';

export default function BlockCheckboxInput({ dataPath, path, tooltip }) {
  const state = useTrackedState();
  const dispatch = useUpdate();

  function handleCheckbox(event) {
    dispatch({
      type: 'CHANGE_DATA',
      path,
      dataPath,
      value: event.currentTarget.checked,
    });
  }

  const value = _.get(state.blocks, path.join('.blocks.') + '.data.' + dataPath.join('.'));

  return <div className='BlockInput BlockInputCheckbox'>
    <label>
      <span className="label">{dataPath.join('.').replace('_', ' ')}:</span>
      <input type="checkbox" checked={value ?? false} onChange={handleCheckbox} />
      <div className="checkbox-display default-tooltip-anchor" data-tooltip-key={tooltip}>{value ? '✓' : ''}</div>
    </label>
  </div>;
}
