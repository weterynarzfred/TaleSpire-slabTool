import Layout from '../Layout';

Layout.prototype.scale = function (scale = {}) {
  const usedScale = { x: 1, y: 1, z: 1 };
  Object.assign(usedScale, scale);

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

  const center = {
    x: (maximums.x + minimums.x) / 2,
    y: (maximums.y + minimums.y) / 2,
    z: (maximums.z + minimums.z) / 2,
  };

  for (let i = 0; i < this.layouts.length; i++) {
    for (let j = 0; j < this.layouts[i].assets.length; j++) {
      this.layouts[i].assets[j].x = (this.layouts[i].assets[j].x - center.x) * usedScale.x + center.x;
      this.layouts[i].assets[j].y = (this.layouts[i].assets[j].y - center.y) * usedScale.y + center.y;
      this.layouts[i].assets[j].z = (this.layouts[i].assets[j].z - center.z) * usedScale.z + center.z;
    }
  }

  return this.cleanup();
};
