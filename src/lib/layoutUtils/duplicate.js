import Layout from '../Layout';
import parseInput from '../parseInput';
import { applyBlock } from '../reducer/recalculateLayout';

Layout.prototype.duplicate = function ({ count = 1, modifiers = "relative" }, blocks = {}, scope = {}) {

  const usedCount = parseInput('integer', count, 1, scope);
  const initialLayout = this.clone();
  let lastLayout = this.clone();
  for (let i = modifiers === "relative" ? 1 : 0; i < usedCount; i++) {
    scope.iter = i;
    if (modifiers === 'relative') {
      for (const id in blocks) applyBlock(lastLayout, blocks[id], scope);
      this.add(lastLayout.clone());
    } else if (modifiers === 'absolute') {
      lastLayout = initialLayout.clone();
      for (const id in blocks) applyBlock(lastLayout, blocks[id], scope);
      this.add(lastLayout);
    }
  }

  delete scope.iter;

  return this.cleanup();
};
