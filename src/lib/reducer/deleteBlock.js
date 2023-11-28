import { blockAtPath } from './utils';
import recalculateLayout from './recalculateLayout';

export default function deleteBlock(state, action) {
  const currentPath = [...action.path];
  const id = currentPath.pop();
  const parentBlock = blockAtPath(state, currentPath);
  delete parentBlock.blocks[id];
  recalculateLayout(state);
}
