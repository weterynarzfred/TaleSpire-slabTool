import Layout from '../Layout';
import { decodeSlab } from '../encoding';
import readSlab from '../readSlab';

Layout.prototype.replace = function (
  {
    from = 'all',
    from_uuid = '',
    to = 'uuid',
    to_uuid = '',
    to_slab = ''
  },
  scope,
  fromSeq = 0
) {
  const floor = (fromSeq ?? 0);

  let slabLayout;
  if (from === 'uuid') {
    if (from_uuid === '') throw new Error('uuid empty');
    if (!from_uuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/))
      throw new Error('incorrect uuid format');
  }
  if (to === 'uuid') {
    if (to_uuid === '') throw new Error('uuid empty');
    if (!to_uuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/))
      throw new Error('incorrect uuid format');
  } else if (to === 'slab') {
    if (to_slab === '') throw new Error('slab empty');
    try { slabLayout = new Layout(readSlab(decodeSlab(to_slab))); }
    catch { throw new Error('incorrect slab format'); }
  }

  // Collect & remove in-scope assets to replace
  const assetsToReplace = [];

  for (const l of this.layouts) {
    if (from === 'uuid' && from_uuid !== l.uuid) continue;

    const kept = [];
    for (const a of (l.assets ?? [])) {
      if ((a.__seq ?? -1) >= floor) {
        assetsToReplace.push(a);
      } else {
        kept.push(a);
      }
    }
    l.assets = kept;
  }

  // Now add replacements
  if (to === 'uuid') {
    this.layouts.push({
      uuid: to_uuid,
      assets: assetsToReplace
    });
  } else if (to === 'slab') {
    for (const asset of assetsToReplace) {
      const slabClone = slabLayout.clone()
        .offset({ offset: asset }, scope, 0)
        .rotate({ rotation: '' + asset.rotation, center: 'center' }, scope, 0)
        .cleanup();

      // New geometry: strip seq so parent assigns fresh ids
      slabClone._stripSeq(slabClone.layouts);

      this.add(slabClone);
    }
  }

  return this.cleanup();
};
