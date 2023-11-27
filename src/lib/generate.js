import LayoutArc from './layouts/LayoutArc';
import LayoutArray from './layouts/LayoutArray';
import Layout from './Layout';

// "e39623c4-77bc-44f7-b591-8e9fdfc2414d" - brick
// "6f145508-4bb0-45eb-bff9-5b625ddce745" - shelf
// "c088991c-5896-43d2-91a1-0e2268490ba4" - chair
// "fa309f05-6efc-41ec-91a7-1157fb7029f3" - mug of beer
// "6b834055-c529-4c15-a3e1-eaf72d7aef4b" - barrel

function generate() {
  const wall = new LayoutArray({
    uuids: [
      "e39623c4-77bc-44f7-b591-8e9fdfc2414d",
    ],
    counts: [15, 8, 1],
    offsets: [
      { x: 0, y: 0, z: 0.53 },
      { x: 0, y: 0.25, z: 0.53 / 2 },
      { x: 0.53, y: 0, z: 0.53 / 2 },
    ],
    bounds: { x: 0, y: 0, z: 0.53 * 15 },
  });

  const arc = new LayoutArc({
    uuids: [
      "6f145508-4bb0-45eb-bff9-5b625ddce745",
    ],
    count: 90,
    arc: 720,
    radius: 15 * 0.53,
    offset: { y: 10 },
  }).rotateElements(90)
    .offset({ x: 0.02, y: 0.02, z: 0.02 }, true)
    .offset({ x: -7.5 * 0.53, z: 7.5 * 0.53 });

  const layout = arc
    .add(
      wall.clone()
        .offset({ x: 0.04, y: 0.02, z: 0.02 }, true)
        .rotationVariations([0, 90, 180, 270])
        .rotateElements(15, true)
    )
    .add(
      wall.clone()
        .offset({ x: 0.04, y: 0.02, z: 0.02 }, true)
        .rotationVariations([0, 90, 180, 270])
        .rotateElements(15, true)
        .rotate(90)
        .offset({ z: 15 * 0.53 })
    )
    .add(
      wall.clone()
        .offset({ x: 0.04, y: 0.02, z: 0.02 }, true)
        .rotationVariations([0, 90, 180, 270])
        .rotateElements(15, true)
        .rotate(180)
        .offset({ x: -15 * 0.53, z: 15 * 0.53 })
    )
    .add(
      wall.clone()
        .offset({ x: 0.04, y: 0.02, z: 0.02 }, true)
        .rotationVariations([0, 90, 180, 270])
        .rotateElements(15, true)
        .rotate(270)
        .offset({ x: -15 * 0.53 })
    ).offset({ x: 7.5 * 0.53, z: -7.5 * 0.53 })
    .rotate(30);

  const tower = new LayoutArc({
    uuids: ["e39623c4-77bc-44f7-b591-8e9fdfc2414d"],
    count: 36,
    arc: 360,
    radius: 2.5,
    offset: { y: 2, z: 1 },
  }).array({ y: 0.25, z: 1 / 36, rotation: 5 }, 25)
    .rotationVariations([0, 90, 180, 270])
    .offset({ x: 0.02, y: 0.02, z: 0.02 }, true);

  layout.add(tower);

  return layout.toOrigin().layouts;
}

export default generate;