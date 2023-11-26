import _ from 'underscore';
import Layout from '../Layout';

/**
 * @typedef {object} vector3
 * @property {number} x
 * @property {number} y
 * @property {number} z
 */

/**
 * @typedef {object} settings
 * @property {string[]} uuids
 * @property {number[]} counts
 * @property {vector3[]} offsets
 * @property {number} rotationVariations
 * @property {vector3} randomOffset
 * @property {vector3} bounds
 */

const DEFAULT_SETTINGS = {
  uuids: ["e39623c4-77bc-44f7-b591-8e9fdfc2414d"],
  counts: [1, 1, 1],
  offsets: [
    { x: 0, y: 0, z: 1 },
    { x: 1, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
  ],
  bounds: { x: 0, y: 0, z: 0 },
};

function getOffset(settings, i, j, k) {
  const axes = { x: 0, y: 0, z: 0 };
  for (const axis in axes) {
    let offset = settings.offsets[2][axis] * k +
      settings.offsets[1][axis] * j +
      settings.offsets[0][axis] * i;

    if (settings.bounds[axis]) {
      offset %= settings.bounds[axis] - 0.001;
    }

    axes[axis] = offset;
  }

  return axes;
}

export default class LayoutArray extends Layout {
  /**
   * Arranges elements in a grid
   * @param {settings} settings
   */
  constructor(settings) {
    const setts = _.clone(DEFAULT_SETTINGS);
    Object.assign(setts, settings);

    const layouts = [];

    for (let i = 0; i < setts.counts[0]; i++) {
      for (let j = 0; j < setts.counts[1]; j++) {
        for (let k = 0; k < setts.counts[2]; k++) {
          const { x, y, z } = getOffset(setts, i, j, k);

          layouts.push({
            uuid: setts.uuids[Math.floor(Math.random() * setts.uuids.length)],
            assets: [{ x, y, z }]
          });
        }
      }
    }

    super(layouts);
  }
}
