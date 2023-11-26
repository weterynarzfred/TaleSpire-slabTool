import _ from 'underscore';
import Layout from '../Layout';

/**
 * @typedef {object} settings
 * @property {string[]} uuids
 * @property {number} count
 * @property {number} radius
 * @property {number} arc
 */

const DEFAULT_SETTINGS = {
  uuids: ["e39623c4-77bc-44f7-b591-8e9fdfc2414d"],
  count: 1,
  radius: 1,
  arc: 360,
};

export default class LayoutArc extends Layout {
  /**
   * Arranges elements in an arc
   * @param {settings} settings
   */
  constructor(settings) {
    const setts = _.clone(DEFAULT_SETTINGS);
    Object.assign(setts, settings);

    const layouts = [];

    for (let i = 0; i < setts.count; i++) {
      const arcPos = i / setts.count * setts.arc / 180 * Math.PI;
      const layout = {
        uuid: setts.uuids[Math.floor(Math.random() * setts.uuids.length)],
        assets: [{
          x: Math.sin(arcPos) * setts.radius,
          y: 0,
          z: Math.cos(arcPos) * setts.radius,
          rotation: arcPos * 180 / Math.PI,
        }]
      };
      layouts.push(layout);
    }

    super(layouts);
  }
}
