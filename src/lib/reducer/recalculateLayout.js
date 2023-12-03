import Layout from '../Layout';

function applyBlock(layout, block) {
  try {
    if (block.type === 'slab') {
      const newLayout = new Layout(_.cloneDeep(block.data.layouts));

      if (block.blocks && Object.keys(block.blocks).length) {
        const blockArray = Object.values(block.blocks)
          .sort((a, b) => a.order - b.order);
        for (const subBlock of blockArray) {
          applyBlock(newLayout, subBlock);
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
    } else if (block.type === 'replace') {

      layout.replace(block.data);
    }
    block.isError = false;
  } catch (e) {
    block.isError = true;
    block.error = e.message;
  }
}

export default function recalculateLayout(state) {
  const layout = new Layout();
  const blockArray = Object.values(state.blocks)
    .sort((a, b) => a.order - b.order);
  for (const block of blockArray) {
    applyBlock(layout, block);
  }
  layout.normalize();

  state.layout = layout.clone();
}

export { applyBlock };
