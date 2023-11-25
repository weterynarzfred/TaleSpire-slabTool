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
    if (['Music'].includes(key)) continue;

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

  return parsedIndex;
}

function readSlab(buffer) {
  // console.log(Array.from(new Uint8Array(buffer)));
  let bufferPointer = 0;

  // header
  const header = new Uint32Array(buffer.slice(bufferPointer, bufferPointer += 4))[0];
  // console.log('header: ' + header);

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

const HEADER_SIZE = 10;
const LAYOUT_SIZE = 20;
const ASSET_SIZE = 8;
const ADDITIONAL_DATA_SIZE = 2; // ?
function writeSlab(layouts) {
  const header = 0xD1CEFACE;
  const version = 2;
  const layoutCount = layouts.length;
  const totalAssetCount = layouts.reduce((sum, layout) => sum + layout.assets.length, 0);

  const buffer = new ArrayBuffer(
    HEADER_SIZE +
    layoutCount * LAYOUT_SIZE +
    totalAssetCount * ASSET_SIZE +
    ADDITIONAL_DATA_SIZE
  );
  const view = new DataView(buffer);
  let bufferPointer = 0;

  view.setUint32(bufferPointer, header, true);
  bufferPointer += 4;

  view.setUint16(bufferPointer, version, true);
  bufferPointer += 2;

  view.setUint16(bufferPointer, layoutCount, true);
  bufferPointer += 2;

  // skip creature count bytes (not in use)
  bufferPointer += 2;

  for (const layout of layouts) {
    const uuidArray = layout.uuid.split('-');
    view.setUint32(bufferPointer, parseInt(uuidArray[0], 16), true);
    bufferPointer += 4;
    view.setUint16(bufferPointer, parseInt(uuidArray[1], 16), true);
    bufferPointer += 2;
    view.setUint16(bufferPointer, parseInt(uuidArray[2], 16), true);
    bufferPointer += 2;
    view.setUint8(bufferPointer, parseInt(uuidArray[3].slice(0, 2), 16), true);
    bufferPointer += 1;
    view.setUint8(bufferPointer, parseInt(uuidArray[3].slice(2), 16), true);
    bufferPointer += 1;
    Array.from(uuidArray[4].matchAll(/[0-9a-f]{2}/g)).forEach(e => {
      view.setUint8(bufferPointer, parseInt(e[0], 16), true);
      bufferPointer += 1;
    });
    view.setUint16(bufferPointer, layout.assets.length, true);
    bufferPointer += 2;

    // skip _reserved_ bytes (?)
    bufferPointer += 2;
  }

  for (const layout of layouts) {
    for (const asset of layout.assets) {
      const assetBinaryString = [
        "00000",
        Math.round(asset.rotation / 15).toString(2).padStart(5, '0'),
        Math.round(asset.z * 100).toString(2).padStart(18, '0'),
        Math.round(asset.y * 100).toString(2).padStart(18, '0'),
        Math.round(asset.x * 100).toString(2).padStart(18, '0'),
      ].join('');
      Array.from(assetBinaryString.matchAll(/[0-1]{8}/g)).reverse().forEach(e => {
        view.setUint8(bufferPointer, parseInt(e[0], 2), true);
        bufferPointer += 1;
      });
    }
  }

  return buffer;
}

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
  readSlab,
  writeSlab,
  decodeSlab,
  encodeSlab,
};
