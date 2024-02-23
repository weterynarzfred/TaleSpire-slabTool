import _ from 'lodash';
import { useUpdate, useTrackedState } from '../StateProvider';

export default function BlockSelectInput({ path, dataPath, options, def = "", tooltip }) {
  const state = useTrackedState();
  const dispatch = useUpdate();

  function handleChange(event) {
    dispatch({
      type: "CHANGE_DATA",
      path,
      dataPath,
      value: event.currentTarget.value,
    });
  }

  const value = _.get(state.blocks, path.join('.blocks.') + '.data.' + dataPath.join('.')) ?? def.value;

  const radioOptions = options.map((option) => {
    return <label key={option.value}>
      <input
        className="radioOption"
        value={option.value}
        checked={value === option.value}
        type='radio'
        name={path.join('.blocks.') + '.data.' + dataPath.join('.')}
        onChange={handleChange}
      >
      </input>
      <div>{option.label}</div>
    </label>;
  });

  return <div className="BlockInput BlockSelectInput">
    <div className="label">{dataPath.join('.').replace("_", " ")}: </div>
    <div
      className="default-tooltip-anchor"
      data-tooltip-key={tooltip}>
      {radioOptions}
    </div>
  </div>;
}
