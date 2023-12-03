import { blockAtPath, getId } from './utils';
import recalculateLayout from './recalculateLayout';

export default function addBlock(state, action) {
  const parentBlock = blockAtPath(state, action.path);
  if (parentBlock.blocks === undefined) parentBlock.blocks = {};
  const id = getId();
  parentBlock.blocks[id] = {
    id,
    path: [...action.path, id],
    type: action.blockType,
    data: {},
  };
  if (['slab'].includes(action.blockType)) {
    parentBlock.blocks[id].isSubListHidden = true;
  }
  recalculateLayout(state);
}
