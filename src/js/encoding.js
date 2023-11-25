import pako from 'pako';

function decodeSlab(paste) {
  if (!paste) throw "slab empty";

  const binaryString = atob(paste.replace(/[` ]/g, ""));
  const bitArray = binaryString.split('').map(x => x.charCodeAt(0));
  const deflatedData = new Uint8Array(bitArray);
  const data = pako.inflate(deflatedData);

  return data.buffer;
}

function encodeSlab(binaryData) {
  const bitData = pako.gzip(binaryData);
  const binaryString = String.fromCharCode(...Array.from(bitData));
  const paste = btoa(binaryString);

  return '```' + paste + '```';
}

export {
  decodeSlab,
  encodeSlab,
};
