import Layout from '../Layout';
import parseInput from '../parseInput';

Layout.prototype.scale = function (
  {
    scale = {},
    center = "zero",
    axis_offset = {}
  },
  scope,
  fromSeq = 0
) {
  const floor = (fromSeq ?? 0);

  const usedScale = {
    x: parseInput('float', scale.x, 1, scope),
    y: parseInput('float', scale.y, 1, scope),
    z: parseInput('float', scale.z, 1, scope),
  };

  const axisPosition = {
    x: parseInput('float', axis_offset.x, 0, scope),
    y: parseInput('float', axis_offset.y, 0, scope),
    z: parseInput('float', axis_offset.z, 0, scope),
  };

  if (center === "center") {
    const minimums = { x: Infinity, y: Infinity, z: Infinity };
    const maximums = { x: -Infinity, y: -Infinity, z: -Infinity };

    for (let i = 0; i < this.layouts.length; i++) {
      for (const asset of this.layouts[i].assets) {
        if ((asset.__seq ?? -1) < floor) continue;

        minimums.x = Math.min(minimums.x, asset.x);
        minimums.y = Math.min(minimums.y, asset.y);
        minimums.z = Math.min(minimums.z, asset.z);
        maximums.x = Math.max(maximums.x, asset.x);
        maximums.y = Math.max(maximums.y, asset.y);
        maximums.z = Math.max(maximums.z, asset.z);
      }
    }

    if (minimums.x !== Infinity) {
      axisPosition.x += (minimums.x + maximums.x) / 2;
      axisPosition.y += (minimums.y + maximums.y) / 2;
      axisPosition.z += (minimums.z + maximums.z) / 2;
    }
  }

  for (let i = 0; i < this.layouts.length; i++) {
    for (let j = 0; j < this.layouts[i].assets.length; j++) {
      const asset = this.layouts[i].assets[j];
      if ((asset.__seq ?? -1) < floor) continue;

      asset.x -= axisPosition.x;
      asset.y -= axisPosition.y;
      asset.z -= axisPosition.z;

      asset.x *= usedScale.x;
      asset.y *= usedScale.y;
      asset.z *= usedScale.z;

      asset.x += axisPosition.x;
      asset.y += axisPosition.y;
      asset.z += axisPosition.z;
    }
  }

  return this.cleanup();
};
