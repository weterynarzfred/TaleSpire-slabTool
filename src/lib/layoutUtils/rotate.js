import Layout from '../Layout';
import getIndex from '../assetData';
import parseInput from '../parseInput';

function rotateTheCenter(center, rotation) {
  const rotationRad = -rotation / 180 * Math.PI;
  const rotCos = Math.cos(rotationRad);
  const rotSin = Math.sin(rotationRad);

  return {
    x: Math.abs(center.x * rotCos - center.z * rotSin),
    y: center.y,
    z: Math.abs(center.x * rotSin + center.z * rotCos),
  };
}

Layout.prototype.rotate = function (
  {
    axis = "y",
    center = "zero",
    type = "degree",
    axis_offset = {},
    rotation,
    rotation_variations = "",
    rotation_from,
    rotation_to,
    elements_only = false,
    randomise_per_object = false,
  },
  scope,
  fromSeq = 0
) {
  const parsedIndex = getIndex();
  const floor = (fromSeq ?? 0);

  const axisPosition = {
    x: parseInput('float', axis_offset.x, 0, scope),
    y: parseInput('float', axis_offset.y, 0, scope),
    z: parseInput('float', axis_offset.z, 0, scope),
  };

  const usedRotation = parseInput('float', rotation, 0, scope);
  const usedRotationFrom = parseInput('float', rotation_from, 0, scope);
  const usedRotationTo = parseInput('float', rotation_to, 0, scope);

  let rotationArray = [];
  if (type === "degree") {
    rotationArray = [usedRotation];
  } else if (type === "variation") {
    rotationArray = rotation_variations
      .replaceAll(/[^0-9;,. ]/g, '')
      .split(/[;, ]+/)
      .filter(e => e !== "")
      .map(e => parseFloat(e));
  }
  if (rotationArray.length === 0) rotationArray = [0];

  if (axis !== 'y') elements_only = false;
  if (elements_only) center = 'zero';

  // Compute center only over in-scope assets
  if (center === 'center') {
    const minimums = { x: Infinity, y: Infinity, z: Infinity };
    const maximums = { x: -Infinity, y: -Infinity, z: -Infinity };

    for (let i = 0; i < this.layouts.length; i++) {
      for (const asset of this.layouts[i].assets) {
        if ((asset.__seq ?? -1) < floor) continue;

        minimums.x = Math.min(minimums.x, asset.x);
        minimums.y = Math.min(minimums.y, asset.y);
        minimums.z = Math.min(minimums.z, asset.z);
        maximums.x = Math.max(maximums.x, asset.x);
        maximums.y = Math.max(maximums.y, asset.y);
        maximums.z = Math.max(maximums.z, asset.z);
      }
    }

    if (minimums.x !== Infinity) {
      axisPosition.x += (minimums.x + maximums.x) / 2;
      axisPosition.y += (minimums.y + maximums.y) / 2;
      axisPosition.z += (minimums.z + maximums.z) / 2;
    }
  }

  // Shared rotation (when not randomising per object)
  let sharedRotation = 0;
  let sharedRotCos = 1;
  let sharedRotSin = 0;

  if (!randomise_per_object) {
    sharedRotation = rotationArray[Math.floor(Math.random() * rotationArray.length)];
    sharedRotation += Math.random() * (usedRotationTo - usedRotationFrom) + usedRotationFrom;

    const rotationRad = -sharedRotation / 180 * Math.PI;
    sharedRotCos = Math.cos(rotationRad);
    sharedRotSin = Math.sin(rotationRad);
  }

  for (let i = 0; i < this.layouts.length; i++) {
    const layout = this.layouts[i];

    const indexInfo = parsedIndex[layout.uuid];
    const assetCenter = indexInfo?.type === 'Tiles'
      ? indexInfo.center
      : { x: 0, y: 0, z: 0 };

    for (let j = 0; j < layout.assets.length; j++) {
      const asset = layout.assets[j];
      if ((asset.__seq ?? -1) < floor) continue;

      // Choose rotation per asset (or reuse shared)
      let currentRotation = sharedRotation;
      let rotCos = sharedRotCos;
      let rotSin = sharedRotSin;

      if (randomise_per_object) {
        currentRotation = rotationArray[Math.floor(Math.random() * rotationArray.length)];
        currentRotation += Math.random() * (usedRotationTo - usedRotationFrom) + usedRotationFrom;

        const rotationRad = -currentRotation / 180 * Math.PI;
        rotCos = Math.cos(rotationRad);
        rotSin = Math.sin(rotationRad);
      }

      if (!elements_only) {
        const currentAssetCenter = rotateTheCenter(assetCenter, asset.rotation);

        asset.x -= axisPosition.x - currentAssetCenter.x;
        asset.y -= axisPosition.y - currentAssetCenter.y;
        asset.z -= axisPosition.z - currentAssetCenter.z;

        const oldX = asset.x;
        const oldY = asset.y;
        const oldZ = asset.z;

        if (axis === 'x') {
          asset.y = oldY * rotCos - oldZ * rotSin;
          asset.z = oldY * rotSin + oldZ * rotCos;
        } else if (axis === 'y') {
          asset.x = oldX * rotCos - oldZ * rotSin;
          asset.z = oldX * rotSin + oldZ * rotCos;
        } else if (axis === 'z') {
          asset.x = oldX * rotCos - oldY * rotSin;
          asset.y = oldX * rotSin + oldY * rotCos;
        }

        const rotatedAssetCenter = rotateTheCenter(currentAssetCenter, currentRotation);

        asset.x += axisPosition.x - rotatedAssetCenter.x;
        asset.y += axisPosition.y - rotatedAssetCenter.y;
        asset.z += axisPosition.z - rotatedAssetCenter.z;
      }

      if (axis === 'y') {
        asset.rotation += currentRotation;
      }
    }
  }

  return this.cleanup();
};
