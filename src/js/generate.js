import cleanupGeneratedData from './cleanupGeneratedData';

const CHAIR_UUID = "c088991c-5896-43d2-91a1-0e2268490ba4";
const ITEM_UUID = "fa309f05-6efc-41ec-91a7-1157fb7029f3";
const COUNT = 3;

function generate() {
  const positions = [];

  for (let i = 0; i < COUNT; i++) {
    const radius = i / 20 + 1;
    const rotation = (i / COUNT * 360 + 180) % 360;
    const y = 0;
    const x = Math.sin(2 * Math.PI * i / COUNT) * radius;
    const z = Math.cos(2 * Math.PI * i / COUNT) * radius;
    positions.push({ x, y, z, rotation });
  }


  const layouts = cleanupGeneratedData([
    {
      uuid: CHAIR_UUID,
      assets: positions,
    },
    {
      uuid: CHAIR_UUID,
      assets: positions.map(e => ({
        ...e,
        y: e.y + 1,
        rotation: e.rotation + 1000,
      })),
    },
    {
      uuid: ITEM_UUID,
      assets: positions.map(e => ({ ...e, y: e.y + 0.36 })),
    }
  ]);

  return layouts;
}

export default generate;


