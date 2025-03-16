import _ from 'lodash';
import { useUpdate, useTrackedState } from '../StateProvider';
import { useEffect, useState } from "react";

let changeTimeout;
export default function BlockInput({ path, dataPath, def = 0, tooltip }) {
  const [inputValue, setInputValue] = useState("");
  const state = useTrackedState();
  const dispatch = useUpdate();

  useEffect(() => {
    clearTimeout(changeTimeout);
    changeTimeout = setTimeout(() => {
      dispatch({
        type: "CHANGE_DATA",
        path,
        dataPath,
        value: inputValue,
      });
    }, 500);

    return () => clearTimeout(changeTimeout);
  }, [inputValue]);

  useEffect(() => {
    setInputValue(_.get(state.blocks, path.join('.blocks.') + '.data.' + dataPath.join('.')));
  }, [state.stateReplacementIndex]);

  return <div className="BlockInput">
    <label>
      <div className="label">{dataPath.join('.').replace('_', ' ')}: </div>
      <input type="text" value={inputValue ?? def} onChange={(e) => setInputValue(e.target.value)} className="default-tooltip-anchor" data-tooltip-key={tooltip} />
    </label>
  </div>;
}
