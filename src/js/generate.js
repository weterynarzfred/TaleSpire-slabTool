const CHAIR_UUID = "c088991c-5896-43d2-91a1-0e2268490ba4";
const ITEM_UUID = "fa309f05-6efc-41ec-91a7-1157fb7029f3";
const COUNT = 120;

function generate() {
  const positions = [];

  for (let i = 0; i < COUNT; i++) {
    const radius = i / 20 + 1;
    const rotation = (3 * i / COUNT * 360 + 180) % 360;
    const y = 0;
    const x = Math.sin(3 * 2 * Math.PI * i / COUNT) * radius;
    const z = Math.cos(3 * 2 * Math.PI * i / COUNT) * radius;
    positions.push({ x, y, z, rotation });
  }

  const minX = positions.reduce((min, e) => Math.min(min, e.x), Infinity);
  const minY = positions.reduce((min, e) => Math.min(min, e.y), Infinity);
  const minZ = positions.reduce((min, e) => Math.min(min, e.z), Infinity);

  positions.forEach(e => {
    e.x -= minX;
    e.y -= minY;
    e.z -= minZ;
  });

  return [
    {
      uuid: CHAIR_UUID,
      assets: positions,
    },
    {
      uuid: ITEM_UUID,
      assets: positions.map(e => ({ ...e, y: e.y + 0.36 })),
    }
  ];
}

export default generate;


