import Layout from '../Layout';

Layout.prototype.rotate = function ({ rotation = 0, rotation_variations = "", elements_only = false }) {
  const rotationArray = rotation_variations.replaceAll(/[^0-9;,. ]/g, '').split(/[;, ]+/).filter(e => e !== "");
  elements_only = parseInt(elements_only);

  for (let i = 0; i < this.layouts.length; i++) {
    for (let j = 0; j < this.layouts[i].assets.length; j++) {

      let currentRotation = rotation;
      if (rotation_variations) {
        currentRotation += rotationArray[Math.floor(Math.random() * rotationArray.length)];
      }
      const rotationRad = currentRotation / 180 * Math.PI;
      const rotCos = Math.cos(rotationRad);
      const rotSin = Math.sin(rotationRad);

      if (!elements_only) {
        const oldX = this.layouts[i].assets[j].x;
        const oldZ = this.layouts[i].assets[j].z;
        this.layouts[i].assets[j].x = oldX * rotCos - oldZ * rotSin;
        this.layouts[i].assets[j].z = oldX * rotSin + oldZ * rotCos;
      }

      this.layouts[i].assets[j].rotation -= currentRotation;
    }
  }

  return this.cleanup();
};
