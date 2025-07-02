import Layout from '../Layout';
import parseInput from '../parseInput';
import { applyBlock } from '../reducer/recalculateLayout';

Layout.prototype.duplicate = function ({ count = 1, modifiers = "relative", iterName = "" }, blocks = {}, scope = {}) {

  const usedCount = parseInput('integer', count, 1, scope);
  const initialLayout = this.clone();
  let lastLayout = this.clone();

  if (modifiers === "absolute")
    this.empty();

  const initialIter = scope.iter;
  let depth = 0;
  while (scope[`iter${depth}`] !== undefined) depth++;

  const orderedBlockList = Object.values(blocks).sort((a, b) => a.order - b.order);

  for (let i = modifiers === "relative" ? 1 : 0; i < usedCount; i++) {
    const scoped = { ...scope };
    scoped.iter = i;
    scoped[`iter${depth}`] = i;
    if (iterName !== "") scoped[iterName] = i;

    if (modifiers === 'relative') {
      for (const block of orderedBlockList) applyBlock(lastLayout, block, scoped);
      this.add(lastLayout.clone());
    } else if (modifiers === 'absolute') {
      lastLayout = initialLayout.clone();
      for (const block of orderedBlockList) applyBlock(lastLayout, block, scoped);
      this.add(lastLayout);
    }
  }

  if (depth === 0) delete scope.iter;
  else scope.iter = initialIter;
  delete scope[`iter${depth}`];

  return this.cleanup();
};
