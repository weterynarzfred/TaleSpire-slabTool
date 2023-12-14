import pako from 'pako';

function decodeSlab(paste) {
  const binaryString = atob(paste.replace(/[` ]/g, ""));
  const bitArray = binaryString.split('').map(x => x.charCodeAt(0));
  const deflatedData = new Uint8Array(bitArray);
  const data = pako.inflate(deflatedData);

  return data.buffer;
}

function encodeSlab(binaryData) {
  if (!binaryData) return {};

  const bitData = pako.gzip(binaryData);
  const binaryString = String.fromCharCode(...Array.from(bitData));
  const paste = btoa(binaryString);

  return {
    rawData: binaryData,
    rawDataLength: binaryData.byteLength,
    base64: '```' + paste + '```',
    dataLength: bitData.length
  };
}

export {
  decodeSlab,
  encodeSlab,
};
