import Layout from '../Layout';

Layout.prototype.offset = function (
  offset = {},
  isRandom = false
) {
  const usedOffset = { x: 0, y: 0, z: 0 };
  _.merge(usedOffset, offset);

  for (let i = 0; i < this.layouts.length; i++) {
    for (let j = 0; j < this.layouts[i].assets.length; j++) {
      this.layouts[i].assets[j].x += (isRandom ? (Math.random() * 2 - 1) : 1) * usedOffset.x;
      this.layouts[i].assets[j].y += (isRandom ? (Math.random() * 2 - 1) : 1) * usedOffset.y;
      this.layouts[i].assets[j].z += (isRandom ? (Math.random() * 2 - 1) : 1) * usedOffset.z;
    }
  }

  return this.cleanup();
};
