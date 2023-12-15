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
  }
) {
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

  const assetsToReplace = [];

  const testLayout = this.clone();
  for (let i = 0; i < testLayout.layouts.length; i++) {
    if (from === 'uuid' && from_uuid !== testLayout.layouts[i].uuid) continue;

    assetsToReplace.push(...testLayout.layouts[i].assets);
    testLayout.layouts[i].assets = [];
  }

  if (to === 'uuid') {
    if (!to_uuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/))
      throw new Error('incorrect uuid format');
    testLayout.layouts.push({
      uuid: to_uuid,
      assets: assetsToReplace,
    });
  } else if (to === 'slab') {
    for (const asset of assetsToReplace) {
      const slabClone = slabLayout.clone()
        .offset({ offset: asset })
        .rotate({ rotation: '' + asset.rotation, center: 'center' })
        .cleanup();
      testLayout.add(slabClone);
    }
  }
  testLayout.cleanup();
  this.layouts = testLayout.layouts;

  return this.cleanup();
};
