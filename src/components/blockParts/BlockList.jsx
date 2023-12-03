import _ from 'lodash';
import { useTrackedState, useUpdate } from '../StateProvider';
import BlockDuplicate from '../blocks/BlockDuplicate';
import BlockOffset from '../blocks/BlockOffset';
import BlockRotate from '../blocks/BlockRotate';
import BlockSlab from '../blocks/BlockSlab';
import { blockAtPath } from '../../lib/reducer/utils';
import BlockScale from '../blocks/BlockScale';

function isChildOfDuplicate(state, path) {
  let currentPath = [];
  for (let i = 0; i < path.length; i++) {
    currentPath.push(path[i]);
    const currentBlock = blockAtPath(state, currentPath);
    if (currentBlock.type === 'duplicate') return true;
  }

  return false;
};

export default function BlockList({ path = [] }) {
  const state = useTrackedState();
  const dispatch = useUpdate();
  const parentBlock = blockAtPath(state, path);
  if (parentBlock.isCollapsed) return null;

  function handleAddSlab(blockType) {
    dispatch({
      type: "ADD_BLOCK",
      blockType,
      path,
    });
  }

  const hasSubBlocks = parentBlock.blocks && Object.keys(parentBlock.blocks).length;
  const blockElements = [];
  if (!parentBlock.isSubListHidden) {
    for (const id in parentBlock.blocks) {
      const block = parentBlock.blocks[id];
      if (block.type === 'slab') {
        blockElements.push(<BlockSlab key={id} block={block} />);
      } else if (block.type === 'duplicate') {
        blockElements.push(<BlockDuplicate key={id} block={block} />);
      } else if (block.type === 'offset') {
        blockElements.push(<BlockOffset key={id} block={block} />);
      } else if (block.type === 'rotate') {
        blockElements.push(<BlockRotate key={id} block={block} />);
      } else if (block.type === 'scale') {
        blockElements.push(<BlockScale key={id} block={block} />);
      }
    }
  }

  return <div className="BlockList">
    {parentBlock.isSubListHidden ? null :
      <>
        {blockElements}
        <div className="block-controls">
          {
            isChildOfDuplicate(state, path) ? null :
              <button className="add-block-button" onClick={() => handleAddSlab('slab')}>add slab</button>
          }
          {
            isChildOfDuplicate(state, path) ? null :
              <button className="add-block-button" onClick={() => handleAddSlab('duplicate')}>add duplicate</button>
          }
          <button className="add-block-button" onClick={() => handleAddSlab('offset')}>add offset</button>
          <button className="add-block-button" onClick={() => handleAddSlab('rotate')}>add rotate</button>
          <button className="add-block-button" onClick={() => handleAddSlab('scale')}>add scale</button>
        </div>
      </>
    }
    {path.length > 0 ? <button
      className="BlockList__hide"
      onClick={() => dispatch({
        type: "SET_BLOCK_PROPERTY",
        path,
        key: 'isSubListHidden',
        value: !parentBlock.isSubListHidden
      })}
    >{parentBlock.isSubListHidden ? `show sub-blocks (${hasSubBlocks ? Object.keys(parentBlock.blocks).length : 0})` : 'hide'}</button> : null}
  </div>;
}
