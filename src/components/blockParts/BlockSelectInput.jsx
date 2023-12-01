import Select from 'react-select';
import _ from 'lodash';
import { useUpdate, useTrackedState } from '../StateProvider';

export default function BlockSelectInput({ path, dataPath, options, def = "" }) {
  const state = useTrackedState();
  const dispatch = useUpdate();

  function handleChange(selected) {
    dispatch({
      type: "CHANGE_DATA",
      path,
      dataPath,
      value: selected.value,
    });
  }

  const value = _.get(state.blocks, path.join('.blocks.') + '.data.' + dataPath.join('.'));

  return <div className="BlockInput BlockSelectInput">
    <label>
      <div className="label">{dataPath.join('.').replace("_", " ")}: </div>
      <Select
        className='select'
        classNamePrefix="select"
        isSearchable={false}
        defaultValue={value ?? def}
        options={options}
        onChange={handleChange}
      />
    </label>
  </div>;
}
