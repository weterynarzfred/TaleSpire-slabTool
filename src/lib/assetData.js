import index1 from '../data/index_cyberpunk_sci-fi.json';
import index2 from '../data/index_medieval_fantasy.json';


const indexes = [
  index1,
  index2,
];

const parsedIndex = {};
for (const index of indexes) {
  for (const key in index) {
    const assetArray = index[key];
    if (!Array.isArray(assetArray)) continue;
    if (!['Tiles', 'Props', 'Creatures'].includes(key)) continue;

    for (const asset of assetArray) {
      if (asset.Id === undefined) continue;

      const assetData = {
        family: index.Name,
        type: key,
        folder: asset.Folder,
        group: asset.GroupTag,
        name: asset.Name,
        // uuid: asset.Id,
        // colliderBounds: asset.ColliderBoundsBound,
        // assets: asset.Assets,
      };

      parsedIndex[asset.Id] = assetData;
    }
  }
}

export default parsedIndex;
