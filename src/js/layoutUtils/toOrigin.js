import Layout from '../Layout';

Layout.prototype.toOrigin = function () {
  const minimums = { x: Infinity, y: Infinity, z: Infinity };
  for (const layout of this.layouts) {
    for (const asset of layout.assets) {
      minimums.x = Math.min(minimums.x, asset.x);
      minimums.y = Math.min(minimums.y, asset.y);
      minimums.z = Math.min(minimums.z, asset.z);
    }
  }

  for (const layout of this.layouts) {
    for (const asset of layout.assets) {
      asset.x -= minimums.x;
      asset.y -= minimums.y;
      asset.z -= minimums.z;
      asset.rotation = (asset.rotation % 360 + 360) % 360;
    }
  }

  return this;
};
