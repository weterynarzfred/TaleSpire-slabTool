import Layout from '../Layout';
import parseInput from '../parseInput';

Layout.prototype.offset = function ({ offset = {}, is_random = false }, scope, fromSeq = 0) {
  const usedOffset = {
    x: parseInput('float', offset.x, 0, scope),
    y: parseInput('float', offset.y, 0, scope),
    z: parseInput('float', offset.z, 0, scope),
  };

  let randX = is_random ? (Math.random() * 2 - 1) : 1;
  let randY = is_random ? (Math.random() * 2 - 1) : 1;
  let randZ = is_random ? (Math.random() * 2 - 1) : 1;

  const floor = (fromSeq ?? 0);

  for (let i = 0; i < this.layouts.length; i++) {
    for (let j = 0; j < this.layouts[i].assets.length; j++) {
      const a = this.layouts[i].assets[j];
      if ((a.__seq ?? -1) < floor) continue;

      a.x += randX * usedOffset.x;
      a.y += randY * usedOffset.y;
      a.z += randZ * usedOffset.z;
    }
  }

  return this.cleanup();
};
