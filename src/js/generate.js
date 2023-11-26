import cleanupGeneratedData from './cleanupGeneratedData';
import layoutArc from './layouts/layoutArc';
import layoutArray from './layouts/layoutArray';
import rotateLayout from './layoutUtils/rotateLayout';

function generate() {
  let layouts = layoutArray({
    uuids: [
      "e39623c4-77bc-44f7-b591-8e9fdfc2414d", // brick
      // "6f145508-4bb0-45eb-bff9-5b625ddce745",
      // "c088991c-5896-43d2-91a1-0e2268490ba4",
      // "fa309f05-6efc-41ec-91a7-1157fb7029f3",
      // "6b834055-c529-4c15-a3e1-eaf72d7aef4b",
    ],
    counts: [15, 6, 1],
    offsets: [
      { x: 0, y: 0, z: 0.53 },
      { x: 0, y: 0.25, z: 0.53 / 2 },
      { x: 0.53, y: 0, z: 0.53 / 2 },
    ],
    rotate: 0,
    rotateMax: 0,
    rotationVariations: 4,
    // randomOffset: { x: 0.02, y: 0.02, z: 0.02 },
    bounds: { x: 0, y: 0, z: 0.53 * 15 },
  });

  layouts = layouts.concat(layoutArc({
    uuids: [
      "6f145508-4bb0-45eb-bff9-5b625ddce745",
    ],
    count: 30,
    arc: 90,
    radius: 5,
    rotate: 90,
  }));

  return cleanupGeneratedData(rotateLayout(layouts, 0));
}

export default generate;


