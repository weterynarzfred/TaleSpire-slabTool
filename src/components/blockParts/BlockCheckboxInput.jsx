import _ from 'lodash';
import { useTrackedState, useUpdate } from '../StateProvider';

export default function BlockCheckboxInput({ dataPath, path, tooltip, def = false }) {
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
  const checkedValue = value !== undefined ? value : def;

  return <div className='BlockInput BlockInputCheckbox'>
      <label>
        <span
          className={tooltip ? "label default-tooltip-anchor" : "label"}
          data-tooltip-key={tooltip}
        >
          {dataPath.join('.').replace('_', ' ')}:
        </span>
        <input type="checkbox" checked={checkedValue} onChange={handleCheckbox} />
        <div className="checkbox-display default-tooltip-anchor" data-tooltip-key={tooltip}>{checkedValue ? '✓' : ''}</div>
      </label>
    </div>;
}
