function getBlockAtPath(state, path) {
  if (!path || !path.length) return state;
  return _.get(state.blocks, path.join('.blocks.'));
}

// function setBlockAtPath(state, path, block) {
//   if (!path || !path.length) state = block;
//   _.set(state.blocks, path.join('.blocks.'), block);
// }

const getId = (() => {
  let lastId = 0;
  return () => lastId++;
})();

export {
  getId,
  getBlockAtPath,
  // setBlockAtPath
};
