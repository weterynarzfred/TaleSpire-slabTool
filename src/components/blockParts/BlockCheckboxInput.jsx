import { useTrackedState, useUpdate } from '../StateProvider';
import tooltips from '../../data/tooltips.json';

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
      <div className="checkbox-display" data-tooltip-id="default-tooltip" data-tooltip-html={tooltips[tooltip]}>{value ? '✓' : ''}</div>
    </label>
  </div>;
}
