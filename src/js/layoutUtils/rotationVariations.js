import Layout from '../Layout';

Layout.prototype.rotationVariations = function (variations = [0]) {
  for (let i = 0; i < this.layouts.length; i++) {
    for (let j = 0; j < this.layouts[i].assets.length; j++) {
      this.layouts[i].assets[j].rotation += variations[Math.floor(Math.random() * variations.length)];
    }
  }

  return this.cleanup();
};
