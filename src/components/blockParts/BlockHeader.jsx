import { useUpdate } from '../StateProvider';

export default function BlockHeader({ block }) {
  const dispatch = useUpdate();

  function handleBlockHeaderClick(event) {
    if (event.isFromButton) return;
    dispatch({
      type: "SET_BLOCK_PROPERTY",
      path: block.path,
      key: 'isCollapsed',
      value: !block.isCollapsed,
    });
  }

  function handleBlockDeleteButton(event) {
    event.isFromButton = true;
    dispatch({
      type: "DELETE_BLOCK",
      path: block.path,
    });
  }

  function handleBlockMove(event, direction) {
    event.isFromButton = true;
    dispatch({
      type: "MOVE_BLOCK",
      direction,
      path: block.path,
    });
  }

  const hasSubBlocks = block.blocks && Object.keys(block.blocks).length;
  return <div className="BlockHeader" onClick={handleBlockHeaderClick}>
    <svg className="BlockDeleteButton" viewBox="0 0 100 100" onClick={handleBlockDeleteButton}>
      <path d="M30 30L70 70" />
      <path d="M30 70L70 30" />
    </svg>
    <div className="block__title-bar">
      <div className="block__move">
        <div className="block__move-up" onClick={event => handleBlockMove(event, -1)}>up</div>
        <div className="block__move-down" onClick={event => handleBlockMove(event, 1)}>down</div>
      </div>
      <div className="block__title">
        {block.type} {block.isCollapsed && hasSubBlocks ? `(+${Object.keys(block.blocks).length})` : ''}
      </div>
      {block.isError ? <div className="block__error">({block.error})</div> : null}
    </div>
  </div>;
}
