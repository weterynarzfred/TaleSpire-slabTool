import Layout from "../lib/Layout";
import { evaluate } from "mathjs";
import { applyBlock } from "../lib/reducer/recalculateLayout";

export async function computeTemplateResult({ blocks, templateHeader }) {
  const layout = new Layout();
  const scope = {};

  // Evaluate header safely
  try {
    evaluate(templateHeader, scope);
  } catch (e) {
    throw new Error("Invalid templateHeader: " + e.message);
  }

  // Apply blocks
  const blockArray = Object.values(blocks || {}).sort((a, b) => a.order - b.order);
  for (const block of blockArray) {
    applyBlock(layout, block, scope);
  }

  layout.normalize();

  return layout.base64;
}
