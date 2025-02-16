import Layout from '../Layout';

function applyBlock(layout, block, scope = {}) {
  try {
    if (block.type === 'slab') {
      const newLayout = new Layout(_.cloneDeep(block.data.layouts));

      if (block.blocks && Object.keys(block.blocks).length) {
        const blockArray = Object.values(block.blocks)
          .sort((a, b) => a.order - b.order);
        for (const subBlock of blockArray) {
          applyBlock(newLayout, subBlock, scope);
        }
      }
      layout.add(newLayout);
    } else if (block.type === 'duplicate') {
      layout.duplicate(block.data, block.blocks, scope);
    } else if (block.type === 'offset') {
      layout.offset(block.data, scope);
    } else if (block.type === 'rotate') {
      layout.rotate(block.data, scope);
    } else if (block.type === 'scale') {
      layout.scale(block.data, scope);
    } else if (block.type === 'replace') {
      layout.replace(block.data, scope);
    } else if (block.type === 'filter') {
      layout.filter(block.data, block.blocks, scope);
    } else if (block.type === 'group') {
      if (block.blocks && Object.keys(block.blocks).length) {
        const blockArray = Object.values(block.blocks)
          .sort((a, b) => a.order - b.order);
        for (const subBlock of blockArray) {
          applyBlock(layout, subBlock, scope);
        }
      }
    }

    block.isError = false;
  } catch (e) {
    block.isError = true;
    block.error = e.message;
    // console.error(e);
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
