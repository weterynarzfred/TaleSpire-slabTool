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
