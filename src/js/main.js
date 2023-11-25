import { decodeSlab, encodeSlab, readSlab, writeSlab } from './talespire';

const readSlabPaste = '```H4sIAAAAAAAACjv369xFJgZmBgYGgUWHGX9Pme/S4z7T7pZdoRojUCzUoTlb86ioz+KHr77rVr33BontTk44nxfD7rj55RyeqOPhGUxAsRQGMGDezvCEcQLbAaBxHOwObCChExAZBgD13dgLaAAAAA==```';

const readSlabData = readSlab(decodeSlab(readSlabPaste));

const writeSlabPaste = encodeSlab(writeSlab([
  {
    "uuid": "01c3a210-94fb-449f-8c47-993eda3e7126",
    "assets": [
      {
        "x": 1,
        "y": 0,
        "z": 0,
        "rotation": 180
      }
    ]
  },
  {
    "uuid": "6b834055-c529-4c15-a3e1-eaf72d7aef4b",
    "assets": [
      {
        "x": 1.83,
        "y": 1.21,
        "z": 1.05,
        "rotation": 225
      }
    ]
  },
  {
    "uuid": "cf6063bb-5c6e-4107-b3e9-9c0c5ac75768",
    "assets": [
      {
        "x": 0,
        "y": 0.5,
        "z": 0,
        "rotation": 0
      },
      {
        "x": 0,
        "y": 0,
        "z": 10,
        "rotation": 0
      }
    ]
  }
]));

// const slabBinaryData = decodeSlab(testSlabPaste);
// const slabData = readSlab(readSlabBinaryData);
// console.log(readSlabData);

document.getElementById('content').innerHTML = `
<h2>read slab:</h2>
<pre>${JSON.stringify(readSlabData, null, 2)}</pre>
<h2>written slab:</h2>
<pre>${writeSlabPaste}</pre>
`;
