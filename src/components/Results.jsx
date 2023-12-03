import bytes from 'bytes';
import { useTrackedState } from './StateProvider';
import { useRef } from 'react';

export default function Results() {
  const state = useTrackedState();
  const data = state.layout.binaryData;

  const copyButtonRef = useRef(null);
  const base64InputRef = useRef(null);

  function handleCopyButton() {
    navigator.clipboard.writeText(base64InputRef.current.value).then(() => {
      copyButtonRef.current.innerText = 'copied';
      setTimeout(() => copyButtonRef.current.innerText = 'copy', 500);
    });
  }

  return <div className="block block--results">
    <div className="BlockHeader">
      <div className="block__title-bar">
        <div className="block__title">results</div>
      </div>
    </div>
    <div className="block__contents">
      <div className="controls">
        <button className="copy-button" ref={copyButtonRef} onClick={handleCopyButton}>copy</button>
        <div className="byte-count">{bytes(data.dataLength)}</div>
      </div>
      <textarea className="json-input" readOnly value={state.layout.json} />
      <textarea className="base64-input" ref={base64InputRef} readOnly value={data.base64} />
    </div>
  </div>;
}
