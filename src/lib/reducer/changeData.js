import recalculateLayout from './recalculateLayout';
import { getBlockAtPath } from './utils';

export default function changeData(state, action) {
  const block = getBlockAtPath(state, action.path);
  _.set(block.data, action.dataPath.join('.'), action.value);
  recalculateLayout(state);
}
