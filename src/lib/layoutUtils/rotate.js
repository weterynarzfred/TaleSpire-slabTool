import Layout from '../Layout';

Layout.prototype.rotate = function ({ axis = "y", center = "zero", axis_offset = {}, rotation_variations = "", rotation_from = 0, rotation_to = 0, elements_only = false }) {
  const axisPosition = { x: 0, y: 0, z: 0 };
  _.merge(axisPosition, axis_offset);
  const rotationArray = rotation_variations.replaceAll(/[^0-9;,. ]/g, '').split(/[;, ]+/).filter(e => e !== "").map(e => parseFloat(e));

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

  for (let i = 0; i < this.layouts.length; i++) {
    for (let j = 0; j < this.layouts[i].assets.length; j++) {

      let currentRotation = rotationArray[Math.floor(Math.random() * rotationArray.length)];
      currentRotation += Math.random() * (rotation_to - rotation_from) + rotation_from;
      const rotationRad = -currentRotation / 180 * Math.PI;
      const rotCos = Math.cos(rotationRad);
      const rotSin = Math.sin(rotationRad);

      if (!elements_only) {
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
      }

      if (axis === 'y') {
        this.layouts[i].assets[j].rotation += currentRotation;
      }
    }
  }

  return this.cleanup();
};
