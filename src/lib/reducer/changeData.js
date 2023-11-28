import recalculateLayout from './recalculateLayout';
import { blockAtPath } from './utils';

export default function changeData(state, action) {
  const block = blockAtPath(state, action.path);
  _.set(block.data, action.dataPath.join('.'), action.value);
  recalculateLayout(state);
}
