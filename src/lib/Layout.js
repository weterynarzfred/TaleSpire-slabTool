import _ from 'lodash';
import { encodeSlab } from './encoding';
import writeSlab from './writeSlab';

export default class Layout {
  layouts;

  constructor(layouts = []) {
    this.layouts = layouts;
    this.cleanup();
  }

  add(addedLayout) {
    this.layouts = this.layouts.concat(addedLayout.layouts);
    return this.cleanup();
  }

  addAsset(uuid, position) {
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
