import { getBlockAtPath, getId } from './utils';
import recalculateLayout from './recalculateLayout';

export default function addBlock(state, action) {
  const parentBlock = getBlockAtPath(state, action.path);
  if (parentBlock.blocks === undefined) parentBlock.blocks = {};
  const id = getId();
  parentBlock.blocks[id] = {
    id,
    path: [...action.path, id],
    order: Object.keys(parentBlock.blocks).length,
    type: action.blockType,
    data: {},
  };

  recalculateLayout(state);
}
