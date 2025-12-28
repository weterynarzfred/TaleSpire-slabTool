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
    // Evaluate any string expressions in block.data into scope
    if (block.data) {
      const flatData = flattenData(block.data);
      for (const [key, val] of Object.entries(flatData)) {
        if (typeof val === "string" && val.trim()) {
          try {
            const evaluated = evaluate(val, scope);
            // Avoid poisoning scope with null (can crash mathjs later)
            if (evaluated !== undefined && evaluated !== null) {
              scope[key] = evaluated;
            }
          } catch {
            // parse/eval errors ignored by design
          }
        }
      }
    }

    const applySubBlocks = (targetLayout, subBlocks, childScope) => {
      const blockArray = Object.values(subBlocks).sort((a, b) => a.order - b.order);
      for (const subBlock of blockArray) {
        applyBlock(targetLayout, subBlock, childScope);
      }
    };

    switch (block.type) {
      case 'slab': {
        const newLayout = new Layout(_.cloneDeep(block.data.layouts));

        if (block.blocks) {
          const slabScope = Object.create(scope);
          slabScope.assetStart = 0; // slab-local children only affect slab-local assets
          applySubBlocks(newLayout, block.blocks, slabScope);
        }

        // This newLayout represents "new geometry". Strip seq so parent assigns fresh global ids on add.
        newLayout._stripSeq(newLayout.layouts);

        layout.add(newLayout);
        break;
      }

      case 'duplicate':
        layout.duplicate(block.data, block.blocks, scope, scope.assetStart ?? 0);
        break;

      case 'offset':
        layout.offset(block.data, scope, scope.assetStart ?? 0);
        break;

      case 'rotate':
        layout.rotate(block.data, scope, scope.assetStart ?? 0);
        break;

      case 'scale':
        layout.scale(block.data, scope, scope.assetStart ?? 0);
        break;

      case 'replace':
        layout.replace(block.data, scope, scope.assetStart ?? 0);
        break;

      case 'filter':
        layout.filter(block.data, block.blocks, scope, scope.assetStart ?? 0);
        break;

      case 'group': {
        // Scope boundary: anything created after this point is "in group"
        const groupScope = Object.create(scope);
        groupScope.assetStart = layout._seq; // next asset id at group entry

        if (block.blocks) applySubBlocks(layout, block.blocks, groupScope);
        break;
      }
    }

    block.isError = false;
  } catch (e) {
    block.isError = true;
    block.error = e.message;
  }
}

export default function recalculateLayout(state) {
  const layout = new Layout();

  // TemplateHeader globals live here
  const headerScope = {};

  try {
    evaluate(state.templateHeader, headerScope);
    state.templateHeaderError = undefined;
  } catch (e) {
    state.templateHeaderError = e.message;
  }

  // All blocks inherit from TemplateHeader globals
  const scope = Object.create(headerScope);
  scope.assetStart = 0;

  const blockArray = Object.values(state.blocks).sort((a, b) => a.order - b.order);

  for (const block of blockArray) {
    applyBlock(layout, block, scope);
  }

  layout.normalize();
  state.layout = layout.clone();
}

export { applyBlock };
