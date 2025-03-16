import { useEffect, useRef, useState } from 'react';
import { jsonrepair } from 'jsonrepair';
import bytes from 'bytes';
import classNames from 'classnames';
import Layout from '../../lib/Layout';
import { decodeSlab } from '../../lib/encoding';
import readSlab from '../../lib/readSlab';
import { useTrackedState, useUpdate } from '../StateProvider';
import BlockHeader from '../blockParts/BlockHeader';
import BlockList from '../blockParts/BlockList';
import BlockContents from '../blockParts/BlockContents';

export default function BlockSlab({ className, block }) {
  const state = useTrackedState();
  const dispatch = useUpdate();

  const [base64, setBase64] = useState("");
  const [json, setJson] = useState("");
  const [dataLength, setDataLength] = useState("");
  const [isError, setIsError] = useState(false);

  const copyButtonRef = useRef(null);
  const base64InputRef = useRef(null);

  useEffect(() => {
    try {
      const newLayout = new Layout(block.data.layouts);
      const binaryData = newLayout.binaryData;
      setJson(newLayout.json);
      setBase64(binaryData.base64);
      setDataLength(binaryData.dataLength);
    } catch {
      setJson("something is bRoKeN;");
      setBase64("something is bRoKeN;");
      setDataLength("");
    }
  }, [state.stateReplacementIndex]);

  function saveLayout(layout) {
    dispatch({
      type: "CHANGE_DATA",
      path: block.path,
      dataPath: ['layouts'],
      value: layout.layouts,
    });
  }

  function handleJsonInput(event) {
    setJson(event.currentTarget.value);
    parseJson(event.currentTarget.value);
  }

  function parseJson(json) {
    try {
      const cleanedJson = jsonrepair(json);
      const layoutsObject = JSON.parse(cleanedJson);
      const newLayout = new Layout(layoutsObject);
      const binaryData = newLayout.binaryData;
      setBase64(binaryData.base64);
      setDataLength(binaryData.dataLength);
      saveLayout(newLayout);
      setIsError(false);
    } catch (e) {
      console.error(e);
      setBase64("something is bRoKeN;");
      setIsError(true);
      setDataLength("");
    }
  }

  function handleBase64Input(event) {
    setBase64(event.currentTarget.value);
    parseBase64(event.currentTarget.value);
  }

  function parseBase64(base64) {
    try {
      const decodedSlab = decodeSlab(base64);
      const layoutsObject = readSlab(decodedSlab);
      const newLayout = new Layout(layoutsObject);
      setJson(newLayout.json);
      const binaryData = newLayout.binaryData;
      setDataLength(binaryData.dataLength);
      saveLayout(newLayout);
      setIsError(false);
    } catch (e) {
      console.error(e);
      setJson("something is bRoKeN;");
      setIsError(true);
      setDataLength("");
    }
  }

  function handleCopyButton() {
    const slab = base64InputRef.current.value;
    if (typeof TS === 'undefined') {
      navigator.clipboard.writeText(slab).then(() => {
        copyButtonRef.current.innerText = 'copied';
        setTimeout(() => copyButtonRef.current.innerText = 'grab from this slab', 500);
      });
    } else {
      TS.system.clipboard.setText(slab);
      TS.slabs.sendSlabToHand(slab);
      copyButtonRef.current.innerText = 'copied';
      setTimeout(() => copyButtonRef.current.innerText = 'grab from this slab', 500);
    }
  }

  function handleEyedropperButton() {
    if (typeof TS === 'undefined') return;
    TS.picking.startPicking();

    document.addEventListener('onPickingEvent', event => {
      if (event.detail.kind !== 'pickingCompleted') return;
      const json = JSON.stringify([{
        uuid: event.detail.payload.idOfPicked,
        assets: [{ x: 0, y: 0, z: 0, rotation: 0 }]
      }], null, 2);
      setJson(json);
      parseJson(json);
    }, { once: true });
  }

  // disabled until talespire bug is fixed
  // function handleReadButton() {
  //   TS.slabs.getSlabInActiveSelection().then(() => {
  //     console.log(result);
  //     setBase64(result);
  //     parseBase64(result);
  //   });
  // }

  return <div className={classNames(className, `block block--${block.type}`, {
    "block--is-collapsed": block.isCollapsed,
    "block--is-error": block.isError || isError,
  })}>
    <BlockHeader block={block} />

    <BlockContents block={block}>
      <div className="controls">
        {/* <button className="read-button" onClick={handleReadButton}>read</button> */}
        <button className="eyedropper-button default-tooltip-anchor" data-tooltip-key="slab_eyedropperButton" onClick={handleEyedropperButton}></button>
        <div className="byte-count">{bytes(dataLength) ?? '???'}</div>
        <button className="copy-button default-tooltip-anchor" data-tooltip-key="slab_copyButton" ref={copyButtonRef} onClick={handleCopyButton}>grab from this slab</button>
      </div>
      <textarea className="json-input default-tooltip-anchor" placeholder="data"
        spellCheck="false" value={json} onChange={handleJsonInput} data-tooltip-key="slab_json" />
      <textarea className="base64-input default-tooltip-anchor" ref={base64InputRef} placeholder="base64"
        spellCheck="false" value={base64} onChange={handleBase64Input} data-tooltip-key="slab_base64" />
    </BlockContents>

    <BlockList path={block.path} />
  </div>;
};
