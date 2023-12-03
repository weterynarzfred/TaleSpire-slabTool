import _ from 'lodash';
import classNames from 'classnames';
import { useUpdate, useTrackedState } from '../StateProvider';

export default function BlockTextInput({ path, dataPath, def = "", className = "" }) {
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

  return <div className={classNames("BlockInput BlockTextInput", className)}>
    <label>
      <div className="label">{dataPath.join('.').replace("_", " ")}: </div>
      <input type="text" value={value ?? def} onChange={handleChange} />
    </label>
  </div>;
}