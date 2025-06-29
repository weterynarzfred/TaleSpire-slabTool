import _ from 'lodash';
import { useUpdate, useTrackedState } from '../StateProvider';

export default function BlockUuidInput({ path, dataPath, def = "", tooltip }) {
  const state = useTrackedState();
  const dispatch = useUpdate();

  function handleChange(event) {
    changeData(event.currentTarget.value);
  }

  function changeData(value) {
    dispatch({
      type: "CHANGE_DATA",
      path,
      dataPath,
      value,
    });
  }

  function handleEyedropperButton() {
    if (typeof TS === 'undefined') return;
    TS.picking.startPicking();
    document.addEventListener('onPickingEvent', event => {
      if (event.detail.kind !== 'pickingCompleted') return;
      changeData(event.detail.payload.idOfPicked);
    }, { once: true });
  }

  const value = _.get(state.blocks, path.join('.blocks.') + '.data.' + dataPath.join('.'));

  return <div className="BlockInput BlockUuidInput">
    <label>
      <div
        className={tooltip ? "label default-tooltip-anchor" : "label"}
        data-tooltip-key={tooltip}
      >
        {dataPath.join('.').replace('_', ' ')}:
      </div>
      <input type="text" value={value ?? def} onChange={handleChange} className="default-tooltip-anchor" data-tooltip-key={tooltip} />
      <button className="eyedropper-button" onClick={handleEyedropperButton}></button>
    </label>
  </div>;
}
