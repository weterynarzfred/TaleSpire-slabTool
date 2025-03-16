function getBlockAtPath(state, path) {
  if (!path || !path.length) return state;
  return _.get(state.blocks, path.join('.blocks.'));
}

// function setBlockAtPath(state, path, block) {
//   if (!path || !path.length) state = block;
//   _.set(state.blocks, path.join('.blocks.'), block);
// }

let lastId = 0;
function getId() {
  return ++lastId;
};

function setLastId(id) {
  lastId = id;
};

export {
  getId,
  getBlockAtPath,
  // setBlockAtPath,
  setLastId,
};
