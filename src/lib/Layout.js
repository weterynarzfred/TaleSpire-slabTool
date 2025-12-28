import _ from 'lodash';
import { encodeSlab } from './encoding';
import writeSlab from './writeSlab';

export default class Layout {
  layouts;
  _seq = 0;

  constructor(layouts = []) {
    this.layouts = layouts;

    // Initialise sequence counter from existing assets (if any)
    let maxSeq = -1;
    for (const l of this.layouts) {
      for (const a of (l.assets ?? [])) {
        if (typeof a.__seq === 'number') maxSeq = Math.max(maxSeq, a.__seq);
      }
    }
    this._seq = maxSeq + 1;

    // Ensure every asset has a seq marker
    this._assignSeqIfMissing(this.layouts);

    this.cleanup();
  }

  _assignSeqIfMissing(layouts) {
    for (const l of layouts) {
      for (const a of (l.assets ?? [])) {
        if (typeof a.__seq !== 'number') a.__seq = this._seq++;
      }
    }
  }

  // Used when a layout represents "new geometry" being added into a parent,
  // so the parent can assign fresh global seq ids.
  _stripSeq(layouts) {
    for (const l of layouts) {
      for (const a of (l.assets ?? [])) delete a.__seq;
    }
  }

  empty() {
    this.layouts = [];
  }

  add(addedLayout) {
    // Preserve seq if present; assign if missing.
    this._assignSeqIfMissing(addedLayout.layouts);
    this.layouts = this.layouts.concat(addedLayout.layouts);
    return this.cleanup();
  }

  addAsset(uuid, position) {
    // If we're moving an existing asset, keep its __seq.
    // If it's new, assign one.
    if (typeof position.__seq !== 'number') position.__seq = this._seq++;
    this.layouts.push({ uuid, assets: [position] });
    return this.cleanup();
  }

  removeAsset(uuid, assetIndex) {
    for (let i = 0; i < this.layouts.length; i++) {
      if (this.layouts[i].uuid !== uuid) continue;
      return this.layouts[i].assets.splice(assetIndex, 1)[0];
    }
  }

  clone() {
    return new Layout(JSON.parse(JSON.stringify(this.layouts)));
  }

  get base64() {
    const { base64 } = this.binaryData;
    return base64;
  }

  get binaryData() {
    return encodeSlab(writeSlab(this.layouts));
  }

  get json() {
    return JSON.stringify(this.layouts, null, 2);
  }
}

// load all files from the layoutUtils dir
const context = require.context("./layoutUtils", true, /\.js$/);
context.keys().forEach(context);