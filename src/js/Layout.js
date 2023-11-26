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
}

// load all files from the layoutUtils dir
const context = require.context("./layoutUtils", true, /\.js$/);
context.keys().forEach(context);
