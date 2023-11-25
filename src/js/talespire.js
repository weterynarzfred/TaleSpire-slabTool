import pako from 'pako';

import assetIndex from '../../data/index_medieval_fantasy.json';

/**
 * slab buffer structure:
 * https://github.com/Bouncyrock/DumbSlabStats/blob/master/format.md
 */

const parsedIndex = parseIndex(assetIndex);

function parseIndex(assetIndex) {
  const parsedIndex = {};

  for (const key in assetIndex) {
    const assetArray = assetIndex[key];
    if (!Array.isArray(assetArray)) continue;
    for (const asset of assetArray) {
      if (asset.Id === undefined) continue;

      const assetData = {
        family: assetIndex.Name,
        type: key,
        folder: asset.Folder,
        group: asset.GroupTag,
        uuid: asset.Id,
        name: asset.Name,
        // colliderBounds: asset.ColliderBoundsBound,
        // assets: asset.Assets,
      };

      parsedIndex[asset.Id] = assetData;
    }
  }
  console.log(parsedIndex);

  return parsedIndex;
}

function readSlab(binaryData) {
  const buffer = binaryData.buffer;
  let bufferPointer = 0;

  // header
  new Uint32Array(buffer.slice(bufferPointer, bufferPointer += 4))[0];

  const version = new Uint16Array(buffer.slice(bufferPointer, bufferPointer += 2))[0];
  // console.log('version: ' + version);

  const layoutCount = new Uint16Array(buffer.slice(bufferPointer, bufferPointer += 2))[0];
  // console.log('number of layouts ' + layoutCount);

  // skip creature count bytes (not in use)
  bufferPointer += 2;

  const layouts = [];
  let totalAssetCount = 0;

  const UUID_BYTE_LENGTHS = [8, 4, 4, 2, 2];
  for (let i = 0; i < layoutCount; i++) {
    const uuidArray = [
      new Uint32Array(buffer.slice(bufferPointer, bufferPointer += 4)),
      new Uint16Array(buffer.slice(bufferPointer, bufferPointer += 2)),
      new Uint16Array(buffer.slice(bufferPointer, bufferPointer += 2)),
      new Uint8Array(buffer.slice(bufferPointer, bufferPointer += 2)),
      new Uint8Array(buffer.slice(bufferPointer, bufferPointer += 6)),
    ];
    const uuid = uuidArray.map((x, index) =>
      Array.from(x).map(y =>
        ("000000000000" + y.toString(16)).slice(-UUID_BYTE_LENGTHS[index])
      ).join('')
    ).join('-');

    const assetCount = new Uint16Array(buffer.slice(bufferPointer, bufferPointer += 2))[0];
    totalAssetCount += assetCount;

    // skip _reserved_ bytes (?)
    bufferPointer += 2;

    layouts.push({
      uuid,
      data: parsedIndex[uuid],
      assetCount,
      assets: []
    });
  }

  for (let i = 0; i < layoutCount; i++) {
    for (let j = 0; j < layouts[i].assetCount; j++) {
      const assetData = new Uint8Array(buffer.slice(bufferPointer, bufferPointer += 8));
      const assetBinaryString = Array.from(assetData).map(e => ("00000000" + e.toString(2)).slice(-8)).reverse().join('');

      const rotation = parseInt(assetBinaryString.slice(5, 5 + 5), 2) * 15;
      const z = parseInt(assetBinaryString.slice(10, 10 + 18), 2) / 100;
      const y = parseInt(assetBinaryString.slice(28, 28 + 18), 2) / 100;
      const x = parseInt(assetBinaryString.slice(46, 46 + 18), 2) / 100;

      layouts[i].assets.push({ x, y, z, rotation });
    }
  }

  const additionalData = new Uint8Array(buffer.slice(bufferPointer));
  // console.log('no idea what this is: ' + Array.from(additionalData).join(', '));

  return layouts;
}

function decodeSlab(paste) {
  if (!paste) throw "slab empty";

  paste = paste.replace(/[` ]/g, "");

  let binaryString;
  try {
    binaryString = atob(paste);
  } catch {
    throw "slab not in base64 format";
  }

  let deflatedData;
  try {
    const bitArray = binaryString.split('').map(x => x.charCodeAt(0));
    deflatedData = new Uint8Array(bitArray);
  } catch {
    throw "binary data malformed";
  }

  let data;
  try {
    data = pako.inflate(deflatedData);
  } catch {
    throw "unable to extract data";
  }

  return data;
}

export {
  decodeSlab,
  readSlab,
};
