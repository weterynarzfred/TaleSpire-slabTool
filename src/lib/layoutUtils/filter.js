import _ from 'lodash';
import Layout from '../Layout';
import parseInput from '../parseInput';
import { applyBlock } from '../reducer/recalculateLayout';

function countNeighbors(assetArray, assetIndex, minDistance) {
  const position = assetArray[assetIndex];
  const minDistance2 = minDistance * minDistance;

  let neighbors = [];
  for (let i = 0; i < assetArray.length; i++) {
    if (i === assetIndex) continue;
    const dist2 = Math.pow(position.x - assetArray[i].x, 2) +
      Math.pow(position.y - assetArray[i].y, 2) +
      Math.pow(position.z - assetArray[i].z, 2);
    if (dist2 <= minDistance2) neighbors.push(i);
  }
  return neighbors;
}

Layout.prototype.filter = function (
  {
    fraction,
    uuid = "",
    min_dist,
    delete_selected = false
  },
  blocks = {},
  scope
) {
  const usedFraction = parseInput('float', fraction, 1, scope);
  const usedMinDist = parseInput('float', min_dist, 0, scope);

  if (uuid && !uuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/))
    throw new Error('incorrect uuid format');

  let filteredLayout = new Layout();

  for (let i = 0; i < this.layouts.length; i++) {
    if (uuid !== '' && this.layouts[i].uuid !== uuid) continue;

    let movedCount = 0;
    const initialAssetCount = this.layouts[i].assets.length;
    for (let j = 0; j < initialAssetCount; j++) {
      if (Math.random() >= usedFraction) continue;

      filteredLayout.addAsset(
        this.layouts[i].uuid,
        this.removeAsset(this.layouts[i].uuid, j - movedCount)
      );
      movedCount++;
    }
  }

  // move the items that are too far back into the original layout
  if (usedMinDist > 0) {
    const assetArray = [];
    for (let i = 0; i < filteredLayout.layouts.length; i++) {
      for (let j = 0; j < filteredLayout.layouts[i].assets.length; j++) {
        filteredLayout.layouts[i].assets[j].uuid = filteredLayout.layouts[i].uuid;
        filteredLayout.layouts[i].assets[j].index = assetArray.length;
        assetArray.push(filteredLayout.layouts[i].assets[j]);
      }
    }
    for (let assetIndex = 0; assetIndex < assetArray.length; assetIndex++) {
      assetArray[assetIndex].neighbors = countNeighbors(assetArray, assetIndex, usedMinDist);
    }
    assetArray.sort((a, b) => a.neighbors.length - b.neighbors.length);
    let neighborCount = assetArray.reduce((sum, element) => sum + element.neighbors.length, 0);

    while (neighborCount > 0) {
      const selected = assetArray[assetArray.length - 1];
      selected.selected = true;
      neighborCount -= selected.neighbors.length;
      assetArray.filter(e => selected.neighbors.includes(e.index)).forEach(e => {
        e.neighbors = e.neighbors.filter(index => index !== selected.index);
        neighborCount--;
      });
      selected.neighbors = [];
      assetArray.sort((a, b) => a.neighbors.length - b.neighbors.length);
    }

    filteredLayout = new Layout();
    for (const asset of assetArray) {
      if (asset.selected) {
        filteredLayout.addAsset(
          asset.uuid,
          { x: asset.x, y: asset.y, z: asset.z, rotation: asset.rotation }
        );
      } else {
        this.addAsset(
          asset.uuid,
          { x: asset.x, y: asset.y, z: asset.z, rotation: asset.rotation }
        );
      }

    }
  }

  if (!delete_selected) {
    for (const id in blocks) applyBlock(filteredLayout, blocks[id], scope);
    this.add(filteredLayout);
  }

  return this.cleanup();
};
