import Layout from '../Layout';

const ASSET_KEYS = ['x', 'y', 'z', 'rotation'];

Layout.prototype.cleanup = function () {
  const layoutsObject = {};
  for (const layout of this.layouts) {
    if (layout.assets === undefined) continue;

    if (layoutsObject[layout.uuid] === undefined)
      layoutsObject[layout.uuid] = [];

    layoutsObject[layout.uuid].push(...layout.assets);
  }

  this.layouts = [];
  for (const uuid in layoutsObject) {
    this.layouts.push({
      uuid,
      assets: layoutsObject[uuid],
    });
  }

  for (const layout of this.layouts) {
    for (const asset of layout.assets) {
      for (const key of ASSET_KEYS) {
        if (isNaN(asset[key])) asset[key] = 0;
      }
    }
  }

  return this;
};
