import Layout from '../Layout';

Layout.prototype.scale = function ({ axis = 'x', scale = 1 }) {
  let minimum = Infinity;
  let maximum = -Infinity;
  for (const layout of this.layouts) {
    for (const asset of layout.assets) {
      minimum = Math.min(minimum, asset[axis]);
      maximum = Math.max(maximum, asset[axis]);
    }
  }
  const center = (maximum + minimum) / 2;

  for (let i = 0; i < this.layouts.length; i++) {
    for (let j = 0; j < this.layouts[i].assets.length; j++) {
      this.layouts[i].assets[j][axis] = (this.layouts[i].assets[j][axis] - center) * scale + center;
    }
  }

  return this.cleanup();
};
