function cleanupGeneratedData(layouts) {

  const layoutsObject = {};
  for (const layout of layouts) {
    if (layout.assets === undefined) continue;

    if (layoutsObject[layout.uuid] === undefined)
      layoutsObject[layout.uuid] = [];

    layoutsObject[layout.uuid].push(...layout.assets);
  }

  layouts = [];
  for (const uuid in layoutsObject) {
    layouts.push({
      uuid,
      assets: layoutsObject[uuid],
    });
  }

  let minimums = { x: Infinity, y: Infinity, z: Infinity };
  for (const layout of layouts) {
    for (const asset of layout.assets) {
      for (const key in asset) {
        if (isNaN(asset[key])) asset[key] = 0;
      }

      minimums.x = Math.min(minimums.x, asset.x);
      minimums.y = Math.min(minimums.y, asset.y);
      minimums.z = Math.min(minimums.z, asset.z);
    }
  }

  for (const layout of layouts) {
    for (const asset of layout.assets) {
      asset.x -= minimums.x;
      asset.y -= minimums.y;
      asset.z -= minimums.z;
      asset.rotation = (asset.rotation % 360 + 360) % 360;
    }
  }

  return layouts;
}

export default cleanupGeneratedData;
