import bytes from 'bytes';
import { useTrackedState } from './StateProvider';

export default function Results() {
  const state = useTrackedState();
  const data = state.layout.binaryData;

  return <div className="block block--results">
    <div className="block__title">results</div>
    <div className="controls">
      <button className="copy-button">copy</button>
      <div className="byte-count">{bytes(data.dataLength)}</div>
    </div>
    <textarea readOnly value={data.base64} />
  </div>;
}
