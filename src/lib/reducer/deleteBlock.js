import { getBlockAtPath } from './utils';
import recalculateLayout from './recalculateLayout';

export default function deleteBlock(state, action) {
  const currentPath = [...action.path];
  const id = currentPath.pop();
  const parentBlock = getBlockAtPath(state, currentPath);
  delete parentBlock.blocks[id];

  const blockArray = Object.values(parentBlock.blocks || {})
    .sort((a, b) => {
      const orderDiff = a.order - b.order;
      if (orderDiff !== 0) return orderDiff;
      return String(a.id).localeCompare(String(b.id));
    });
  blockArray.forEach((block, index) => block.order = index);

  recalculateLayout(state);
}
