import { blockAtPath, recalculateLayout } from './utils';

export default function deleteBlock(state, action) {
  const id = action.path.pop();
  const parentPath = action.path;
  const parentBlock = blockAtPath(state, parentPath);
  delete parentBlock.blocks[id];
  recalculateLayout(state);
}
