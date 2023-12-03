import Layout from '../Layout';

function applyBlock(layout, block) {
  if (block.type === 'slab') {
    const newLayout = new Layout(_.cloneDeep(block.data.layouts));
    if (block.blocks && Object.keys(block.blocks).length) {
      for (const id in block.blocks) {
        applyBlock(newLayout, block.blocks[id]);
      }
    }
    layout.add(newLayout);
  } else if (block.type === 'duplicate') {
    layout.duplicate(block.data, block.blocks);
  } else if (block.type === 'offset') {
    layout.offset(block.data);
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
  layout.normalize();

  state.layout = layout.clone();
}

export { applyBlock };
