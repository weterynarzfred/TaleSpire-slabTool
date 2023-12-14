export default function BlockContents({ block, children }) {
  if (block.isCollapsed) return null;

  return <div className="block__contents">
    {block.isError ? <div className="block__error">{block.error}</div> : null}
    {children}
  </div>;
}
