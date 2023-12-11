import Layout from '../Layout';

Layout.prototype.scale = function ({ scale = { x: 1, y: 1, z: 1 } }) {
  scale.x = parseFloat(scale.x);
  scale.x = isNaN(scale.x) ? 1 : scale.x;
  scale.y = parseFloat(scale.y);
  scale.y = isNaN(scale.y) ? 1 : scale.y;
  scale.z = parseFloat(scale.z);
  scale.z = isNaN(scale.z) ? 1 : scale.z;

  let minimum = { x: Infinity, y: Infinity, z: Infinity };
  let maximum = { x: -Infinity, y: -Infinity, z: -Infinity };

  for (const layout of this.layouts) {
    for (const asset of layout.assets) {
      minimum.x = Math.min(minimum.x, asset['x']);
      minimum.y = Math.min(minimum.y, asset['y']);
      minimum.z = Math.min(minimum.z, asset['z']);
      maximum.x = Math.max(maximum.x, asset['x']);
      maximum.y = Math.max(maximum.y, asset['y']);
      maximum.z = Math.max(maximum.z, asset['z']);
    }
  }
  const center = {
    x: (maximum.x + minimum.x) / 2,
    y: (maximum.y + minimum.y) / 2,
    z: (maximum.z + minimum.z) / 2,
  };

  for (let i = 0; i < this.layouts.length; i++) {
    for (let j = 0; j < this.layouts[i].assets.length; j++) {
      this.layouts[i].assets[j].x = (this.layouts[i].assets[j].x - center.x) * scale.x + center.x;
      this.layouts[i].assets[j].y = (this.layouts[i].assets[j].y - center.y) * scale.y + center.y;
      this.layouts[i].assets[j].z = (this.layouts[i].assets[j].z - center.z) * scale.z + center.z;
    }
  }

  return this.cleanup();
};
