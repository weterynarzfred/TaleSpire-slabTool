import { useUpdate } from '../StateProvider';

export default function BlockHeader({ block }) {
  const dispatch = useUpdate();

  function handleBlockHeaderClick(event) {
    if (event.isFromDeleteButton) return;
    dispatch({
      type: "SET_BLOCK_PROPERTY",
      path: block.path,
      key: 'isCollapsed',
      value: !block.isCollapsed,
    });
  }

  function handleBlockDeleteButton(event) {
    event.isFromDeleteButton = true;
    dispatch({
      type: "DELETE_BLOCK",
      path: block.path,
    });
  }

  const hasSubBlocks = block.blocks && Object.keys(block.blocks).length;
  return <div className="BlockHeader" onClick={handleBlockHeaderClick}>
    <svg className="BlockDeleteButton" viewBox="0 0 100 100" onClick={handleBlockDeleteButton}>
      <path d="M30 30L70 70" />
      <path d="M30 70L70 30" />
    </svg>
    <div className="block__title">{block.type} {block.isCollapsed && hasSubBlocks ? `+(${Object.keys(block.blocks).length})` : ''}</div>
  </div>;
}
