import { useEffect, useRef, useState } from 'react';
import { jsonrepair } from 'jsonrepair';
import bytes from 'bytes';
import Layout from '../../lib/Layout';
import { decodeSlab } from '../../lib/encoding';
import readSlab from '../../lib/readSlab';
import { useUpdate } from '../StateProvider';
import BlockHeader from '../blockParts/BlockHeader';
import BlockList from '../blockParts/BlockList';

export default function BlockSlab({ block }) {
  const dispatch = useUpdate();

  const [base64, setBase64] = useState("");
  const [json, setJson] = useState("");
  const [dataLength, setDataLength] = useState("");

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
  }, []);

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

    try {
      const cleanedJson = jsonrepair(event.currentTarget.value);
      const layoutsObject = JSON.parse(cleanedJson);
      const newLayout = new Layout(layoutsObject);
      const binaryData = newLayout.binaryData;
      setBase64(binaryData.base64);
      setDataLength(binaryData.dataLength);
      saveLayout(newLayout);
    } catch {
      setBase64("something is bRoKeN;");
      setDataLength("");
    }
  }

  function handleBase64Input(event) {
    setBase64(event.currentTarget.value);

    try {
      const decodedSlab = decodeSlab(event.currentTarget.value);
      const layoutsObject = readSlab(decodedSlab);
      const newLayout = new Layout(layoutsObject);
      setJson(newLayout.json);
      const binaryData = newLayout.binaryData;
      setDataLength(binaryData.dataLength);
      saveLayout(newLayout);
    } catch {
      setJson("something is bRoKeN;");
      setDataLength("");
    }
  }

  function handleCopyButton() {
    navigator.clipboard.writeText(base64InputRef.current.value).then(() => {
      copyButtonRef.current.innerText = 'copied';
      setTimeout(() => copyButtonRef.current.innerText = 'copy', 500);
    });
  }

  return <div className="block block--slab">
    <BlockHeader block={block} />

    <div className="block__contents">
      <div className="controls">
        <button className="copy-button" ref={copyButtonRef} onClick={handleCopyButton}>copy</button>
        <div className="byte-count">{bytes(dataLength) ?? '???'}</div>
      </div>
      <textarea className="json-input" placeholder="data"
        spellCheck="false" value={json} onChange={handleJsonInput} />
      <textarea className="base64-input" ref={base64InputRef} placeholder="base64"
        spellCheck="false" value={base64} onChange={handleBase64Input} />
    </div>

    <BlockList path={block.path} />
  </div>;
};
