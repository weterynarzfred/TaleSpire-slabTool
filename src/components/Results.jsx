import bytes from 'bytes';
import { useTrackedState } from './StateProvider';

export default function Results() {
  const state = useTrackedState();
  const data = state.layout.binaryData;

  return <div className="block block--results">
    <div className="block__title">results</div>
    <div className="block__contents">
      <div className="controls">
        <button className="copy-button">copy</button>
        <div className="byte-count">{bytes(data.dataLength)}</div>
      </div>
      <textarea className="json-input" readOnly value={state.layout.json} />
      <textarea className="base64-input" readOnly value={data.base64} />
    </div>
  </div>;
}
