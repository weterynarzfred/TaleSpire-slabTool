import Layout from '../Layout';

function applyBlock(layout, block) {
  // TODO: change these so that you only need to pass block.data
  if (block.type === 'slab') {
    const newLayout = new Layout(_.cloneDeep(block.data.layouts));
    if (block.blocks && Object.keys(block.blocks).length) {
      for (const id in block.blocks) {
        applyBlock(newLayout, block.blocks[id]);
      }
    }
    layout.add(newLayout);
  } else if (block.type === 'array') {
    layout.array(block.data.offset, block.data.count);
  } else if (block.type === 'offset') {
    layout.offset(block.data.offset, block.data.isRandom);
  } else if (block.type === 'rotate') {
    layout.rotate(block.data);
  } else if (block.type === 'scale') {
    layout.scale(block.data);
  }
}

export default function recalculateLayout(state) {
  const layout = new Layout();
  for (const id in state.blocks) {
    applyBlock(layout, state.blocks[id]);
  }
  layout.toOrigin();

  state.layout = layout.clone();
}
