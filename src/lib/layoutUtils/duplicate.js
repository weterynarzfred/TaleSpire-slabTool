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
  let depth = 1;
  while (scope[`iter${depth}`] !== undefined) depth++;

  for (let i = modifiers === "relative" ? 1 : 0; i < usedCount; i++) {
    scope.iter = i;
    scope[`iter${depth}`] = i;
    if (iterName !== "")
      scope[iterName] = i;

    if (modifiers === 'relative') {
      for (const id in blocks) applyBlock(lastLayout, blocks[id], scope);
      this.add(lastLayout.clone());
    } else if (modifiers === 'absolute') {
      lastLayout = initialLayout.clone();
      for (const id in blocks) applyBlock(lastLayout, blocks[id], scope);
      this.add(lastLayout);
    }
  }

  if (depth === 1) delete scope.iter;
  else scope.iter = initialIter;
  delete scope[`iter${depth}`];

  return this.cleanup();
};
