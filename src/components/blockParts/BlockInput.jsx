import _ from 'lodash';
import { useUpdate, useTrackedState } from '../StateProvider';
import tooltips from '../../data/tooltips.json';

export default function BlockInput({ path, dataPath, def = 0, tooltip }) {
  const state = useTrackedState();
  const dispatch = useUpdate();

  function handleChange(event) {
    const value = event.currentTarget.value;

    dispatch({
      type: "CHANGE_DATA",
      path,
      dataPath,
      value,
    });
  }

  const value = _.get(state.blocks, path.join('.blocks.') + '.data.' + dataPath.join('.'));

  return <div className="BlockInput">
    <label>
      <div className="label">{dataPath.join('.')}: </div>
      <input type="text" value={value ?? def} onChange={handleChange} data-tooltip-id="default-tooltip" data-tooltip-html={tooltips[tooltip]} />
    </label>
  </div>;
}
