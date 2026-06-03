import { evaluate } from "mathjs";
import Layout from '../Layout';

function plainClone(value) {
  return JSON.parse(JSON.stringify(value ?? []));
}

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

            if (evaluated !== undefined && evaluated !== null) {
              scope[key] = evaluated;
            }
          } catch {
            // Ignore expression errors.
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
        const newLayout = new Layout(plainClone(block.data.layouts));

        if (block.blocks) {
          const slabScope = Object.create(scope);
          slabScope.assetStart = 0;
          applySubBlocks(newLayout, block.blocks, slabScope);
        }

        newLayout._stripSeq(newLayout.layouts);
        layout.add(newLayout);
        break;
      }

      case 'text_slab': {
        const newLayout = new Layout();

        newLayout.textSlab(block.data, scope);

        if (block.blocks) {
          const textSlabScope = Object.create(scope);
          textSlabScope.assetStart = 0;
          applySubBlocks(newLayout, block.blocks, textSlabScope);
        }

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
        const groupScope = Object.create(scope);
        groupScope.assetStart = layout._seq;

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

  const headerScope = {};

  try {
    evaluate(state.templateHeader, headerScope);
    state.templateHeaderError = undefined;
  } catch (e) {
    state.templateHeaderError = e.message;
  }

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