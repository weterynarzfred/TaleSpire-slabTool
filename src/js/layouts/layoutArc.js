import _ from 'lodash';
import Layout from '../Layout';

/**
 * @typedef {object} settings
 * @property {string[]} uuids
 * @property {number} count
 * @property {number} radius
 * @property {number} arc
 * @property {vector3} offset
 */

const DEFAULT_SETTINGS = {
  uuids: ["e39623c4-77bc-44f7-b591-8e9fdfc2414d"],
  count: 1,
  radius: 1,
  arc: 360,
  offset: { x: 0, y: 0, z: 0 },
};

export default class LayoutArc extends Layout {
  /**
   * Arranges elements in an arc
   * @param {settings} settings
   */
  constructor(settings) {
    const setts = _.clone(DEFAULT_SETTINGS);
    _.merge(setts, settings);

    const layouts = [];

    const scaledOffset = {
      x: setts.offset.x / setts.count,
      y: setts.offset.y / setts.count,
      z: setts.offset.z / setts.count,
    };
    console.log(scaledOffset);
    for (let i = 0; i < setts.count; i++) {
      const arcPos = i / setts.count * setts.arc / 180 * Math.PI;
      const layout = {
        uuid: setts.uuids[Math.floor(Math.random() * setts.uuids.length)],
        assets: [{
          x: Math.sin(arcPos) * setts.radius + scaledOffset.x * i,
          y: scaledOffset.y * i,
          z: Math.cos(arcPos) * setts.radius + scaledOffset.z * i,
          rotation: arcPos * 180 / Math.PI,
        }]
      };
      layouts.push(layout);
    }

    super(layouts);
  }
}
