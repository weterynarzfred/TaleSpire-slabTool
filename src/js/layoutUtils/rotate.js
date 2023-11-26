import Layout from '../Layout';

Layout.prototype.rotate = function (rotation = 0) {
  const rotationRad = rotation / 180 * Math.PI;
  const rotCos = Math.cos(rotationRad);
  const rotSin = Math.sin(rotationRad);

  for (let i = 0; i < this.layouts.length; i++) {
    for (let j = 0; j < this.layouts[i].assets.length; j++) {
      const oldX = this.layouts[i].assets[j].x;
      const oldZ = this.layouts[i].assets[j].z;

      this.layouts[i].assets[j].x = oldX * rotCos - oldZ * rotSin;
      this.layouts[i].assets[j].z = oldX * rotSin + oldZ * rotCos;
      this.layouts[i].assets[j].rotation -= rotation;
    }
  }

  return this.cleanup();
};
