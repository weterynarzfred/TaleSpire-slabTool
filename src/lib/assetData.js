function waitForTS() {
  return new Promise((resolve) => {
    if (typeof TS !== "undefined") {
      console.log("TS API is loaded:", TS);
      resolve();
    } else {
      console.warn("Waiting for TaleSpire API...");
      setTimeout(() => resolve(waitForTS()), 500);
    }
  });
}

// Create an async function to initialize parsedIndex
async function initializeParsedIndex() {
  await waitForTS(); // Ensure TS is available

  try {
    const contentPacks = await TS.contentPacks.getContentPacks();
    const packInfo = await TS.contentPacks.getMoreInfo(contentPacks);

    const parsedIndex = {}; // Ensure it's only populated after fetching

    for (const index of packInfo) {
      for (const key in index) {
        if (!['tiles', 'props', 'creatures'].includes(key)) continue;
        const assetArray = Object.values(index[key]);

        for (const asset of assetArray) {
          if (asset.id === undefined) continue;

          parsedIndex[asset.id] = {
            type: key,
            group: asset.groupTag,
            name: asset.name,
            center: asset.colliderBoundsBound?.center,
          };
        }
      }
    }

    console.log("Parsed asset index:", parsedIndex);
    return parsedIndex;
  } catch (error) {
    console.error("Error retrieving asset data:", error);
    return {}; // Return an empty object if something fails
  }
}

// Export a **PROMISE** that resolves once parsedIndex is ready
const parsedIndexPromise = initializeParsedIndex();
export default parsedIndexPromise;
