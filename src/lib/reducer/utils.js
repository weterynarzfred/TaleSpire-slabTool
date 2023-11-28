
function blockAtPath(state, path) {
  if (!path || !path.length) return state;
  return _.get(state.blocks, path.join('.blocks.'));
}

const getId = (() => {
  let lastId = 0;
  return () => lastId++;
})();

export {
  getId,
  blockAtPath,
};
