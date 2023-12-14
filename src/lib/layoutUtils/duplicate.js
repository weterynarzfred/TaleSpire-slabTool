import Layout from '../Layout';
import { applyBlock } from '../reducer/recalculateLayout';

Layout.prototype.duplicate = function ({ count = 1, modifiers = "relative" }, blocks = {}) {
  const initialLayout = this.clone();
  let lastLayout = this.clone();
  for (let i = 1; i < count; i++) {
    if (modifiers === 'relative') {
      for (const id in blocks) applyBlock(lastLayout, blocks[id], { iter: i });
      this.add(lastLayout.clone());
    } else if (modifiers === 'absolute') {
      lastLayout = initialLayout.clone();
      for (const id in blocks) applyBlock(lastLayout, blocks[id], { iter: i });
      this.add(lastLayout);
    }
  }

  return this.cleanup();
};
