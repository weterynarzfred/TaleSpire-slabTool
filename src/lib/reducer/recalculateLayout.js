import { evaluate } from "mathjs";
import Layout from '../Layout';
import _ from 'lodash';

function flattenData(data, prefix = "") {
  const result = {};
  for (const key in data) {
    const val = data[key];
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof val === "object" && val !== null && !Array.isArray(val)) {
      Object.assign(result, flattenData(val, path));
    } else {
      result[path] = val;
    }
  }
  return result;
}

function applyBlock(layout, block, scope) {
  if (block.disabled) return;

  try {
    if (block.data) {
      const flatData = flattenData(block.data);
      for (const [key, val] of Object.entries(flatData)) {
        if (typeof val === "string" && val.trim()) {
          try {
            const evaluated = evaluate(val, scope);
            if (evaluated !== undefined) {
              scope[key] = evaluated;
            }
          } catch {
            // parse/eval errors
          }
        }
      }
    }

    const applySubBlocks = (targetLayout, subBlocks) => {
      const blockArray = Object.values(subBlocks)
        .sort((a, b) => a.order - b.order);
      for (const subBlock of blockArray) {
        applyBlock(targetLayout, subBlock, scope);
      }
    };

    switch (block.type) {
      case 'slab': {
        const newLayout = new Layout(_.cloneDeep(block.data.layouts));
        if (block.blocks) applySubBlocks(newLayout, block.blocks);
        layout.add(newLayout);
        break;
      }
      case 'duplicate':
        layout.duplicate(block.data, block.blocks, scope);
        break;
      case 'offset':
        layout.offset(block.data, scope);
        break;
      case 'rotate':
        layout.rotate(block.data, scope);
        break;
      case 'scale':
        layout.scale(block.data, scope);
        break;
      case 'replace':
        layout.replace(block.data, scope);
        break;
      case 'filter':
        layout.filter(block.data, block.blocks, scope);
        break;
      case 'group':
        if (block.blocks) applySubBlocks(layout, block.blocks);
        break;
    }

    block.isError = false;
  } catch (e) {
    block.isError = true;
    block.error = e.message;
  }
}

export default function recalculateLayout(state) {
  const layout = new Layout();
  const scope = {};

  try {
    evaluate(state.templateHeader, scope);
    state.templateHeaderError = undefined;
  } catch (e) {
    state.templateHeaderError = e.message;
  }

  const blockArray = Object.values(state.blocks)
    .sort((a, b) => a.order - b.order);

  for (const block of blockArray) {
    applyBlock(layout, block, scope);
  }

  layout.normalize();

  state.layout = layout.clone();
}

export { applyBlock };
