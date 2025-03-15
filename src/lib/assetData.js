let parsedIndex;

async function prepareIndex() {
  console.log('reading index');
  const contentPacks = await TS.contentPacks.getContentPacks();
  const packInfo = await TS.contentPacks.getMoreInfo(contentPacks);

  parsedIndex = {};
  for (const index of packInfo) {
    for (const key in index) {
      if (!['tiles', 'props', 'creatures'].includes(key)) continue;
      const assetArray = Object.values(index[key]);

      for (const asset of assetArray) {
        if (asset.id === undefined) continue;

        const assetData = {
          type: key,
          group: asset.groupTag,
          name: asset.name,
          center: asset.colliderBoundsBound?.center,
        };

        parsedIndex[asset.id] = assetData;
      }
    }
  }

  return parsedIndex;
}

function getIndex() {
  return parsedIndex;
}


export default getIndex;
export {
  prepareIndex,
};
