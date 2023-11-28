import Layout from '../Layout';

function recalculateLayout(state) {
  const layout = new Layout();
  for (const id in state.blocks) {
    const block = state.blocks[id];

    // TODO: change these so that you only need to pass block.data
    if (block.type === 'slab') {
      layout.add(new Layout(block.data.layouts));
    } else if (block.type === 'array') {
      layout.array(block.data.offset, block.data.count);
    } else if (block.type === 'offset') {
      layout.offset(block.data.offset, block.data.isRandom);
    }
  }
  layout.toOrigin();

  state.layout = layout.clone();
}

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
  recalculateLayout,
  blockAtPath,
};
