import { blockAtPath, getId } from './utils';

export default function addBlock(state, action) {
  const parentBlock = blockAtPath(state, action.path);
  if (parentBlock.blocks === undefined) parentBlock.blocks = {};
  const id = getId();
  switch (action.blockType) {
    case "slab":
      parentBlock.blocks[id] = {
        id,
        type: 'slab',
        data: { layouts: [] },
      };
      break;
    default:
      throw "unrecognized block type";
  }
}
