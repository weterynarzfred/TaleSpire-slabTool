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
        setTimeout(() => (copyButtonRef.current.innerText = 'grab result'), 500);
      });
    } else {
      TS.system.clipboard.setText(slab);
      TS.slabs.sendSlabToHand(slab);
      copyButtonRef.current.innerText = 'copied';
      setTimeout(() => (copyButtonRef.current.innerText = 'grab result'), 500);
    }
  }

  const [dataSize, setDataSize] = useState(0);
  const [maxDataSize, setMaxDataSize] = useState(0);
  const [selectionSize, setSelectionSize] = useState(0);
  const [selectionStatus, setSelectionStatus] = useState('ok');
  const [watchSelection, setWatchSelection] = useState(true); // active by default

  // Base layout size
  useEffect(() => {
    if (typeof TS === 'undefined') return;
    TS.slabs.getDataSize(state.layout.base64).then((result) => setDataSize(result));
  }, [state.layout.base64]);

  // Max allowed size
  useEffect(() => {
    if (typeof TS === 'undefined') return;
    setTimeout(() => {
      TS.slabs.getMaxSlabSizeInBytes().then((result) => setMaxDataSize(result));
    }, 100);
  }, []);

  // Poll selection size
  useEffect(() => {
    if (!watchSelection) return;
    if (typeof TS === 'undefined') return;
    let canceled = false;

    const handle = setInterval(async () => {
      try {
        const slab = await TS.slabs.getSlabInActiveSelection();
        if (canceled) return;

        const getFailure = (val) => {
          if (!val) return null;
          if (typeof val === 'string') return val;
          if (typeof val === 'object') return val.failure || val.error || val.code || null;
          return null;
        };

        const failure = getFailure(slab);
        if (['areaNotReady', 'nothingInsideSelection', 'noActiveSelection'].includes(failure)) {
          setSelectionStatus(failure);
          setSelectionSize(0);
          return;
        }
        if (failure === 'dataOversized') {
          setSelectionStatus('dataOversized');
          return;
        }

        const size = await TS.slabs.getDataSize(slab);
        setSelectionStatus('ok');
        setSelectionSize(size);
      } catch (e) {
        const msg = (e && (e.code || e.message)) ? (e.code || e.message) : '';
        if (['areaNotReady', 'nothingInsideSelection', 'noActiveSelection'].some((k) => msg.includes(k))) {
          setSelectionStatus('areaNotReady');
          setSelectionSize(0);
        } else if (msg.includes('dataOversized')) {
          setSelectionStatus('dataOversized');
        }
      }
    }, 100);

    return () => {
      canceled = true;
      clearInterval(handle);
    };
  }, [watchSelection]);

  const isActive = watchSelection;
  const isOversized =
    selectionStatus === 'dataOversized' || (selectionStatus === 'ok' && selectionSize > maxDataSize);

  const stateClass = !isActive
    ? 'inactive'
    : isOversized
      ? 'active-over'
      : 'active-within';

  const shownSize = selectionStatus === 'ok' ? selectionSize : 0;

  return (
    <div className="block block--results">
      <div className="BlockHeader">
        <div className="block__title-bar">
          <div className="block__title">results</div>
        </div>
      </div>

      <div className="block__contents">
        <div className="controls">
          <div className="title">
            S<span>lab</span>T<span>oo</span>l
          </div>

          {/* Toggle button */}
          <button
            type="button"
            aria-pressed={isActive}
            onClick={() => setWatchSelection((v) => !v)}
            className={`selection-size-toggle default-tooltip-anchor ${stateClass}`}
            data-tooltip-key="selectionToggle"
          >
            {!isActive ? (
              <span className="label">Selection size off</span>
            ) : (
              <span className="count">
                {isOversized ? (
                  <strong>Slab too big</strong>
                ) : (
                  <>
                    {shownSize}B / {maxDataSize}B
                  </>
                )}
              </span>
            )}
          </button>

          <div className="byte-count">
            {dataSize}B / {maxDataSize}B
          </div>

          <button
            className="copy-button default-tooltip-anchor"
            data-tooltip-key="copyButton"
            ref={copyButtonRef}
            onClick={handleCopyButton}
          >
            grab result
          </button>
        </div>

        <textarea className="json-input" readOnly value={state.layout.json} />
        <textarea
          className="base64-input"
          ref={base64InputRef}
          readOnly
          value={data.base64}
        />
      </div>
    </div>
  );
}
