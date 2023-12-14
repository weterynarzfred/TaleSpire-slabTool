import { useUpdate } from '../StateProvider';
import BlockTextInput from './BlockTextInput';

export default function BlockHeader({ block }) {
  const dispatch = useUpdate();

  function handleBlockHeaderClick(event) {
    dispatch({
      type: "SET_BLOCK_PROPERTY",
      path: block.path,
      key: 'isCollapsed',
      value: !block.isCollapsed,
    });
  }

  function handleBlockDeleteButton(event) {
    dispatch({
      type: "DELETE_BLOCK",
      path: block.path,
    });
  }

  function handleBlockMove(event, direction) {
    dispatch({
      type: "MOVE_BLOCK",
      direction,
      path: block.path,
    });
  }

  const hasSubBlocks = block.blocks && Object.keys(block.blocks).length;
  return <div className="BlockHeader">
    <svg className="BlockDeleteButton" viewBox="0 0 100 100" onClick={handleBlockDeleteButton}>
      <path d="M30 30L70 70" />
      <path d="M30 70L70 30" />
    </svg>
    <div className="block__title-bar">
      <div className="block__move">
        <div className="block__move-up" onClick={event => handleBlockMove(event, -1)}>▲</div>
        <div className="block__move-down" onClick={event => handleBlockMove(event, 1)}>▼</div>
      </div>
      <div className="block__title" onClick={handleBlockHeaderClick}>
        {block.type} {block.isCollapsed && hasSubBlocks ? `(+${Object.keys(block.blocks).length})` : ''}
      </div>
      <BlockTextInput path={block.path} dataPath={["user_comment"]} placeholder="// user comment" />
    </div>
  </div>;
}
