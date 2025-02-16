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
    if (typeof TS === 'undefined') {
      navigator.clipboard.writeText(slab).then(() => {
        copyButtonRef.current.innerText = 'copied';
        setTimeout(() => copyButtonRef.current.innerText = 'grab result', 500);
      });
    } else {
      TS.system.clipboard.setText(slab);
      TS.slabs.sendSlabToHand(slab);
      copyButtonRef.current.innerText = 'copied';
      setTimeout(() => copyButtonRef.current.innerText = 'grab result', 500);
    }
  }

  const [dataSize, setDataSize] = useState(0);
  const [maxDataSize, setMaxDataSize] = useState(0);
  useEffect(() => {
    if (typeof TS === 'undefined') return;
    TS.slabs.getDataSize(state.layout.base64).then(result => {
      const size = result;
      setDataSize(size);
    });
  }, [state.layout.base64]);
  useEffect(() => {
    if (typeof TS === 'undefined') return;
    setTimeout(() => {
      TS.slabs.getMaxSlabSizeInBytes().then(result => {
        const size = result;
        setMaxDataSize(size);
      });
    }, 100);
  }, []);

  return <div className="block block--results">
    <div className="BlockHeader">
      <div className="block__title-bar">
        <div className="block__title">results</div>
      </div>
    </div>
    <div className="block__contents">
      <div className="controls">
        <div className="title">S<span>lab</span>T<span>oo</span>l</div>
        <div className="byte-count">{(dataSize)}B / {(maxDataSize)}B</div>
        <button className="copy-button default-tooltip-anchor" data-tooltip-key="copyButton" ref={copyButtonRef} onClick={handleCopyButton}>grab result</button>
      </div>
      <textarea className="json-input" readOnly value={state.layout.json} />
      <textarea className="base64-input" ref={base64InputRef} readOnly value={data.base64} />
    </div>
  </div>;
}
