function rotateLayout(layouts, rotation) {
  const rotationRad = rotation / 180 * Math.PI;

  console.log(...layouts[1].assets);

  for (let i = 0; i < layouts.length; i++) {
    for (let j = 0; j < layouts[i].assets.length; j++) {
      layouts[i].assets[j].rotation += rotation;

      const oldX = layouts[i].assets[j].x;

      layouts[i].assets[j].x = layouts[i].assets[j].z * Math.sin(rotationRad) + layouts[i].assets[j].x * Math.cos(rotationRad);

      layouts[i].assets[j].z = oldX * Math.sin(rotationRad) + layouts[i].assets[j].z * Math.cos(rotationRad);
    }
  }

  return layouts;
}

export default rotateLayout;
