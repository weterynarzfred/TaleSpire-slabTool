import Layout from '../Layout';
import { applyBlock } from '../reducer/recalculateLayout';

Layout.prototype.duplicate = function ({ count = 1 }, blocks = {}) {
  let lastLayout = this.clone();
  for (let i = 1; i < count; i++) {
    for (const id in blocks) applyBlock(lastLayout, blocks[id]);
    this.add(lastLayout.clone());
  }

  return this.cleanup();
};
