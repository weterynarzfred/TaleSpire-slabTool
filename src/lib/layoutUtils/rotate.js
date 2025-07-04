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
    elements_only = false
  },
  scope
) {
  const parsedIndex = getIndex();

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
    rotationArray = rotation_variations.replaceAll(/[^0-9;,. ]/g, '')
      .split(/[;, ]+/).filter(e => e !== "").map(e => parseFloat(e));
  }
  if (rotationArray.length === 0) rotationArray = [0];

  if (axis !== 'y') elements_only = false;
  if (elements_only) center = 'zero';

  if (center === 'center') {
    const minimums = { x: Infinity, y: Infinity, z: Infinity };
    const maximums = { x: -Infinity, y: -Infinity, z: -Infinity };
    for (const layout of this.layouts) {
      for (const asset of layout.assets) {
        minimums.x = Math.min(minimums.x, asset.x);
        minimums.y = Math.min(minimums.y, asset.y);
        minimums.z = Math.min(minimums.z, asset.z);
        maximums.x = Math.max(maximums.x, asset.x);
        maximums.y = Math.max(maximums.y, asset.y);
        maximums.z = Math.max(maximums.z, asset.z);
      }
    }
    axisPosition.x += (minimums.x + maximums.x) / 2;
    axisPosition.y += (minimums.y + maximums.y) / 2;
    axisPosition.z += (minimums.z + maximums.z) / 2;
  }

  let currentRotation = rotationArray[Math.floor(Math.random() * rotationArray.length)];
  currentRotation += Math.random() * (usedRotationTo - usedRotationFrom) + usedRotationFrom;

  for (let i = 0; i < this.layouts.length; i++) {
    const assetCenter = parsedIndex[this.layouts[i].uuid].type === 'Tiles' ? parsedIndex[this.layouts[i].uuid].center : { x: 0, y: 0, z: 0 };

    for (let j = 0; j < this.layouts[i].assets.length; j++) {
      
      const rotationRad = -currentRotation / 180 * Math.PI;
      const rotCos = Math.cos(rotationRad);
      const rotSin = Math.sin(rotationRad);

      if (!elements_only) {
        const currentAssetCenter = rotateTheCenter(assetCenter, this.layouts[i].assets[j].rotation);
        this.layouts[i].assets[j].x -= axisPosition.x - currentAssetCenter.x;
        this.layouts[i].assets[j].y -= axisPosition.y - currentAssetCenter.y;
        this.layouts[i].assets[j].z -= axisPosition.z - currentAssetCenter.z;

        const oldX = this.layouts[i].assets[j].x;
        const oldY = this.layouts[i].assets[j].y;
        const oldZ = this.layouts[i].assets[j].z;

        if (axis === 'x') {
          this.layouts[i].assets[j].y = oldY * rotCos - oldZ * rotSin;
          this.layouts[i].assets[j].z = oldY * rotSin + oldZ * rotCos;
        } else if (axis === 'y') {
          this.layouts[i].assets[j].x = oldX * rotCos - oldZ * rotSin;
          this.layouts[i].assets[j].z = oldX * rotSin + oldZ * rotCos;
        } else if (axis === 'z') {
          this.layouts[i].assets[j].x = oldX * rotCos - oldY * rotSin;
          this.layouts[i].assets[j].y = oldX * rotSin + oldY * rotCos;
        }

        const rotatedAssetCenter = rotateTheCenter(currentAssetCenter, currentRotation);
        this.layouts[i].assets[j].x += axisPosition.x - rotatedAssetCenter.x;
        this.layouts[i].assets[j].y += axisPosition.y - rotatedAssetCenter.y;
        this.layouts[i].assets[j].z += axisPosition.z - rotatedAssetCenter.z;
      }

      if (axis === 'y') {
        this.layouts[i].assets[j].rotation += currentRotation;
      }
    }
  }

  return this.cleanup();
};
