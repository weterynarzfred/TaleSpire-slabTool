import { getBlockAtPath } from './utils';
import recalculateLayout from './recalculateLayout';

export default function moveBlock(state, action) {
  const currentPath = [...action.path];
  const movedId = currentPath.pop();
  const parentBlock = getBlockAtPath(state, currentPath);

  const blockArray = Object.values(parentBlock.blocks)
    .sort((a, b) => a.order - b.order);

  blockArray.forEach((block, index) => block.order = index);
  blockArray.find(block => block.id === movedId).order += action.direction * 1.5;
  blockArray.sort((a, b) => a.order - b.order);
  blockArray.forEach((block, index) => block.order = index);

  recalculateLayout(state);
}
