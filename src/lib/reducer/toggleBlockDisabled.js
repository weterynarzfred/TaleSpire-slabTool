import { getBlockAtPath } from './utils';
import recalculateLayout from './recalculateLayout';

function toggleBlockDisabledRecursively(block, disabled) {
  block.disabled = disabled;
  if (disabled) {
    block.isCollapsed = true;
  } else {
    block.isCollapsed = false;
  }
  if (block.blocks) {
    for (const key in block.blocks) {
      toggleBlockDisabledRecursively(block.blocks[key], disabled);
    }
  }
}

export default function toggleBlockDisabled(state, action) {
  const toggleBlock = getBlockAtPath(state, action.path);
  const newDisabledState = !toggleBlock.disabled;
  toggleBlockDisabledRecursively(toggleBlock, newDisabledState);
  recalculateLayout(state);
}
