import cleanupGeneratedData from './cleanupGeneratedData';
import rotateLayout from './rotateLayout';

const UUIDS = [
  "e39623c4-77bc-44f7-b591-8e9fdfc2414d",
  // "6f145508-4bb0-45eb-bff9-5b625ddce745",
  // "c088991c-5896-43d2-91a1-0e2268490ba4",
  // "fa309f05-6efc-41ec-91a7-1157fb7029f3",
  // "6b834055-c529-4c15-a3e1-eaf72d7aef4b",
];
const COUNTS = [15, 12, 2];
const OFFSETS = [
  { x: 0, y: 0, z: 0.53 },
  { x: 0, y: 0.25, z: 0.53 / 2 },
  { x: 0.53, y: 0, z: 0.53 / 2 },
];
const ROTATE = 0;
const MAX_ROTATE = 360;
const ROTATE_STEP = 90;
const MAX_RANDOM_OFFSET = { x: 0.02, y: 0.02, z: 0.02 };
const BOUNDS = { x: false, y: false, z: 0.53 * 15 };

function getOffset(axis, k, j, i) {
  let offset = OFFSETS[2][axis] * k +
    OFFSETS[1][axis] * j +
    OFFSETS[0][axis] * i;

  if (BOUNDS[axis]) {
    offset %= BOUNDS[axis] - 0.001;
  }

  return offset + (Math.random() * 2 - 1) * MAX_RANDOM_OFFSET[axis];
}

function generate() {
  let layouts = [];

  for (let i = 0; i < COUNTS[0]; i++) {
    for (let j = 0; j < COUNTS[1]; j++) {
      for (let k = 0; k < COUNTS[2]; k++) {
        const rotation = Math.round((Math.random() * (MAX_ROTATE - ROTATE) + ROTATE) / ROTATE_STEP) * ROTATE_STEP;

        const x = getOffset('x', k, j, i);
        const y = getOffset('y', k, j, i);
        const z = getOffset('z', k, j, i);

        layouts.push({
          uuid: UUIDS[Math.floor(Math.random() * UUIDS.length)],
          assets: [{ x, y, z, rotation }]
        });
      }
    }
  }

  return cleanupGeneratedData(rotateLayout(layouts, 30));
}

export default generate;


