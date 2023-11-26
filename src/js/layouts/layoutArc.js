import _ from 'underscore';
import cleanupGeneratedData from '../cleanupGeneratedData';

/**
 * @typedef {object} settings
 * @property {string[]} uuids
 * @property {number} count
 * @property {number} radius
 * @property {number} arc
 * @property {number} rotate
 */

const DEFAULT_SETTINGS = {
  uuids: ["e39623c4-77bc-44f7-b591-8e9fdfc2414d"],
  radius: 1,
  arc: 360,
  rotate: 0,
};

/**
 * Arranges elements in an arc
 * @param {settings} settings
 */
function layoutArc(settings) {
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
        rotation: setts.rotate - arcPos * 180 / Math.PI,
      }]
    };
    layouts.push(layout);
  }

  return cleanupGeneratedData(layouts);
}

export default layoutArc;
