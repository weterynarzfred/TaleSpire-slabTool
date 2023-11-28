import { blockAtPath, getId } from './utils';

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
}
