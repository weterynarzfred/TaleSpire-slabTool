import Layout from '../Layout';

Layout.prototype.rotateElements = function (rotation = 0, isRandom = false) {
  for (let i = 0; i < this.layouts.length; i++) {
    for (let j = 0; j < this.layouts[i].assets.length; j++) {
      this.layouts[i].assets[j].rotation += (isRandom ? (Math.random() * 2 - 1) : 1) * rotation;
    }
  }

  return this.cleanup();
};
