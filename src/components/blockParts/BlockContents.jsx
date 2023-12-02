export default function BlockContents({ block, children }) {
  if (block.isCollapsed) return null;

  return <div className="block__contents">{children}</div>;
}
