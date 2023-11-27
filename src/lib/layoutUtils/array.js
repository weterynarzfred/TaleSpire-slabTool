import Layout from '../Layout';

Layout.prototype.array = function (offset = {}, count = 1) {
  const usedOffset = { x: 0, y: 0, z: 0, rotation: 0 };
  _.merge(usedOffset, offset);

  const layoutCopy = this.clone();
  for (let i = 1; i < count; i++) {
    const tempLayout = layoutCopy.clone();
    tempLayout
      .rotate(usedOffset.rotation * i)
      .offset({ x: usedOffset.x * i, y: usedOffset.y * i, z: usedOffset.z * i });
    this.add(tempLayout);
  }

  return this.cleanup();
};
