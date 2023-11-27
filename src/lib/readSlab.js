/**
 * slab buffer structure:
 * https://github.com/Bouncyrock/DumbSlabStats/blob/master/format.md
 */

import parsedIndex from './assetData';

function readSlab(buffer, showData = true) {
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

    const layout = {
      uuid,
      assetCount,
      assets: []
    };
    if (showData) layout.data = parsedIndex[uuid];
    layouts.push(layout);
  }

  for (let i = 0; i < layoutCount; i++) {
    for (let j = 0; j < layouts[i].assetCount; j++) {
      const assetData = new Uint8Array(buffer.slice(bufferPointer, bufferPointer += 8));
      const assetBinaryString = Array.from(assetData).map(e => ("00000000" + e.toString(2)).slice(-8)).reverse().join('');

      const rotation = parseInt(assetBinaryString.slice(5, 5 + 5), 2) * 15;
      const z = parseInt(assetBinaryString.slice(10, 10 + 18), 2) / 100;
      const y = parseInt(assetBinaryString.slice(28, 28 + 18), 2) / 100;
      const x = parseInt(assetBinaryString.slice(46, 46 + 18), 2) / 100;

      layouts[i].assets.push({ x, z, y, rotation });
    }
    delete layouts[i].assetCount;
  }

  const additionalData = new Uint8Array(buffer.slice(bufferPointer));
  // console.log('no idea what this is: ' + Array.from(additionalData).join(', '));

  return layouts;
}

export default readSlab;
