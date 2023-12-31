import Layout from '../Layout';

Layout.prototype.normalize = function () {
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
      asset.x = Math.min(Math.round((asset.x - minimums.x) * 1e6) / 1e6, 2000);
      asset.y = Math.min(Math.round((asset.y - minimums.y) * 1e6) / 1e6, 2000);
      asset.z = Math.min(Math.round((asset.z - minimums.z) * 1e6) / 1e6, 2000);
      asset.rotation = Math.round(asset.rotation / 15) * 15;
      asset.rotation = (asset.rotation % 360 + 360) % 360;
    }
  }

  return this;
};
