/**
 * slab buffer structure:
 * https://github.com/Bouncyrock/DumbSlabStats/blob/master/format.md
 */

const HEADER_SIZE = 10;
const LAYOUT_SIZE = 20;
const ASSET_SIZE = 8;
const ADDITIONAL_DATA_SIZE = 2; // ?

function writeSlab(layouts) {
  if (!layouts) return;

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


export default writeSlab;
