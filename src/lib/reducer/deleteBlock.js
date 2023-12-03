import { getBlockAtPath } from './utils';
import recalculateLayout from './recalculateLayout';

export default function deleteBlock(state, action) {
  const currentPath = [...action.path];
  const id = currentPath.pop();
  const parentBlock = getBlockAtPath(state, currentPath);
  delete parentBlock.blocks[id];
  recalculateLayout(state);
}
