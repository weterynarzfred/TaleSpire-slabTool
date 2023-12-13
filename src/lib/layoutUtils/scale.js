import Layout from '../Layout';
import parseInput from '../parseInput';

Layout.prototype.scale = function (
  {
    scale = {},
    center = "zero",
    axis_offset = {}
  },
  scope
) {
  scale.x = parseInput('float', scale.x, 1, scope);
  scale.y = parseInput('float', scale.y, 1, scope);
  scale.z = parseInput('float', scale.z, 1, scope);

  const axisPosition = {
    x: parseInput('float', axis_offset.x, 0, scope),
    y: parseInput('float', axis_offset.y, 0, scope),
    z: parseInput('float', axis_offset.z, 0, scope),
  };

  if (center === "center") {
    const minimums = { x: Infinity, y: Infinity, z: Infinity };
    const maximums = { x: -Infinity, y: -Infinity, z: -Infinity };
    for (const layout of this.layouts) {
      for (const asset of layout.assets) {
        minimums.x = Math.min(minimums.x, asset['x']);
        minimums.y = Math.min(minimums.y, asset['y']);
        minimums.z = Math.min(minimums.z, asset['z']);
        maximums.x = Math.max(maximums.x, asset['x']);
        maximums.y = Math.max(maximums.y, asset['y']);
        maximums.z = Math.max(maximums.z, asset['z']);
      }
    }
    axisPosition.x += (minimums.x + maximums.x) / 2;
    axisPosition.y += (minimums.y + maximums.y) / 2;
    axisPosition.z += (minimums.z + maximums.z) / 2;
  }

  for (let i = 0; i < this.layouts.length; i++) {
    for (let j = 0; j < this.layouts[i].assets.length; j++) {
      this.layouts[i].assets[j].x -= axisPosition.x;
      this.layouts[i].assets[j].y -= axisPosition.y;
      this.layouts[i].assets[j].z -= axisPosition.z;

      this.layouts[i].assets[j].x = (this.layouts[i].assets[j].x) * scale.x;
      this.layouts[i].assets[j].y = (this.layouts[i].assets[j].y) * scale.y;
      this.layouts[i].assets[j].z = (this.layouts[i].assets[j].z) * scale.z;

      this.layouts[i].assets[j].x += axisPosition.x;
      this.layouts[i].assets[j].y += axisPosition.y;
      this.layouts[i].assets[j].z += axisPosition.z;
    }
  }

  return this.cleanup();
};
