import BlockDeleteButton from '../BlockDeleteButton';
import { useUpdate } from '../StateProvider';

export default function BlockArray({ data, path }) {
  const dispatch = useUpdate();

  function handleOffsetChange(key, value) {
    const offset = { ...data.offset };
    offset[key] = value;
    dispatch({
      type: "CHANGE_DATA",
      path,
      data: { offset },
    });
  }

  function handleCountChange(value) {
    dispatch({
      type: "CHANGE_DATA",
      path,
      data: { count: value },
    });
  }

  return <div className="block block--array">
    <div className="block__title">array</div>
    <BlockDeleteButton path={path} />

    <div className="block__contents">
      <label>
        <div className="label">x: </div>
        <input type="number" value={data.offset?.x ?? 0} onChange={event => handleOffsetChange('x', event.currentTarget.value)} />
      </label>
      <label>
        <div className="label">y: </div>
        <input type="number" value={data.offset?.y ?? 0} onChange={event => handleOffsetChange('y', event.currentTarget.value)} />
      </label>
      <label>
        <div className="label">z: </div>
        <input type="number" value={data.offset?.z ?? 0} onChange={event => handleOffsetChange('z', event.currentTarget.value)} />
      </label>
      <label>
        <div className="label">rotation: </div>
        <input type="number" value={data.offset?.rotation ?? 0} onChange={event => handleOffsetChange('rotation', event.currentTarget.value)} />
      </label>
      <label>
        <div className="label">count: </div>
        <input type="number" value={data.count ?? 1} onChange={event => handleCountChange(event.currentTarget.value)} />
      </label>
    </div>

    <div className="block__sub-blocks">
      <div className="sub-block-list"></div>
      <div className="sub-block-controls"></div>
    </div>
  </div>;
};
