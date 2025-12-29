import Layout from '../Layout';
import parseInput from '../parseInput';
import { applyBlock } from '../reducer/recalculateLayout';
import _ from 'lodash';

Layout.prototype.duplicate = function (data, blocks = {}, scope = {}, fromSeq = 0) {
  const { count = 1, modifiers = "relative", iterName = "" } = data;

  let usedCount = parseInput('integer', count, 1, scope);
  if (usedCount < 0) usedCount = 0;

  const floor = (fromSeq ?? 0);

  // If count === 0, delete in-scope geometry and exit
  if (usedCount === 0) {
    for (const l of this.layouts) {
      l.assets = (l.assets ?? []).filter(a => (a.__seq ?? -1) < floor);
    }
    return this.cleanup();
  }

  // Build a baseSlice containing ONLY in-scope assets
  const baseSlice = new Layout(_.cloneDeep(this.layouts));
  for (const l of baseSlice.layouts) {
    l.assets = (l.assets ?? []).filter(a => (a.__seq ?? -1) >= floor);
  }
  baseSlice.cleanup();

  if (!baseSlice.layouts.some(l => (l.assets?.length ?? 0) > 0)) {
    return this.cleanup();
  }

  let lastLayout = baseSlice.clone();

  if (modifiers === "absolute") {
    // Remove in-scope assets from this layout, keep out-of-scope assets intact
    for (const l of this.layouts) {
      l.assets = (l.assets ?? []).filter(a => (a.__seq ?? -1) < floor);
    }
    this.cleanup();
  }

  const initialIter = scope.iter;
  let depth = 0;
  while (scope[`iter${depth}`] !== undefined) depth++;

  const orderedBlockList = Object.values(blocks).sort((a, b) => a.order - b.order);

  for (let i = modifiers === "relative" ? 1 : 0; i < usedCount; i++) {
    const scoped = Object.create(scope);
    scoped.assetStart = 0;
    scoped.iter = i;
    scoped[`iter${depth}`] = i;
    if (iterName !== "") scoped[iterName] = i;

    if (modifiers === 'relative') {
      for (const block of orderedBlockList) applyBlock(lastLayout, block, scoped);

      const toAdd = lastLayout.clone();
      toAdd._stripSeq(toAdd.layouts);
      this.add(toAdd);
    } else {
      lastLayout = baseSlice.clone();
      for (const block of orderedBlockList) applyBlock(lastLayout, block, scoped);

      lastLayout._stripSeq(lastLayout.layouts);
      this.add(lastLayout);
    }
  }

  if (depth === 0) delete scope.iter;
  else scope.iter = initialIter;
  delete scope[`iter${depth}`];

  return this.cleanup();
};
