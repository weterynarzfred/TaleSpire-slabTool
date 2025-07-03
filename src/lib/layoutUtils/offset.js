import Layout from '../Layout';
import parseInput from '../parseInput';

Layout.prototype.offset = function ({ offset = {}, is_random = false }, scope) {
  const usedOffset = {
    x: parseInput('float', offset.x, 0, scope),
    y: parseInput('float', offset.y, 0, scope),
    z: parseInput('float', offset.z, 0, scope),
  };

  let randX = is_random ? (Math.random() * 2 - 1) : 1;
  let randY = is_random ? (Math.random() * 2 - 1) : 1;
  let randZ = is_random ? (Math.random() * 2 - 1) : 1;

  for (let i = 0; i < this.layouts.length; i++) {
    for (let j = 0; j < this.layouts[i].assets.length; j++) {
      this.layouts[i].assets[j].x += randX * usedOffset.x;
      this.layouts[i].assets[j].y += randY * usedOffset.y;
      this.layouts[i].assets[j].z += randZ * usedOffset.z;
    }
  }

  return this.cleanup();
};
