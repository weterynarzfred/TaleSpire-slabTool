import bytes from 'bytes';
import { useTrackedState } from './StateProvider';
import { useEffect, useRef, useState } from 'react';

export default function Results() {
  const state = useTrackedState();
  const data = state.layout.binaryData;

  const copyButtonRef = useRef(null);
  const base64InputRef = useRef(null);

  function handleCopyButton() {
    const slab = base64InputRef.current.value;
    navigator.clipboard.writeText(slab).then(() => {
      copyButtonRef.current.innerText = 'copied';
      setTimeout(() => copyButtonRef.current.innerText = 'grab result', 500);
    });
    if (typeof TS === 'undefined') return;
    TS.slabs.sendSlabToHand(slab);
  }

  const [dataSize, setDataSize] = useState(0);
  const [maxDataSize, setMaxDataSize] = useState(0);
  useEffect(() => {
    if (typeof TS === 'undefined') return;
    TS.slabs.getDataSize(state.layout.base64).then(result => {
      const size = result;
      console.log(size, data.dataLength);
      setDataSize(size);
    });
  }, [state.layout.base64]);
  useEffect(() => {
    if (typeof TS === 'undefined') return;
    TS.slabs.getMaxSlabSizeInBytes().then(result => {
      const size = result;
      setMaxDataSize(size);
    });
  }, []);


  return <div className="block block--results">
    <div className="BlockHeader">
      <div className="block__title-bar">
        <div className="block__title">results</div>
      </div>
    </div>
    <div className="block__contents">
      <div className="controls">
        <button className="copy-button" ref={copyButtonRef} onClick={handleCopyButton}>grab result</button>
        <div className="byte-count">{bytes(dataSize)} / {bytes(maxDataSize)}</div>
      </div>
      <textarea className="json-input" readOnly value={state.layout.json} />
      <textarea className="base64-input" ref={base64InputRef} readOnly value={data.base64} />
    </div>
  </div>;
}
