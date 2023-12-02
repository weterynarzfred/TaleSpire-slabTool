import _ from 'lodash';
import { useTrackedState, useUpdate } from '../StateProvider';
import BlockArray from '../blocks/BlockArray';
import BlockOffset from '../blocks/BlockOffset';
import BlockRotate from '../blocks/BlockRotate';
import BlockSlab from '../blocks/BlockSlab';
import { blockAtPath } from '../../lib/reducer/utils';
import BlockScale from '../blocks/BlockScale';

export default function BlockList({ path = [] }) {
  const state = useTrackedState();
  const dispatch = useUpdate();
  const parentBlock = blockAtPath(state, path);
  if (parentBlock.isCollapsed) return;

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
      } else if (block.type === 'array') {
        blockElements.push(<BlockArray key={id} block={block} />);
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
          <button className="add-block-button" onClick={() => handleAddSlab('slab')}>add slab</button>
          <button className="add-block-button" onClick={() => handleAddSlab('array')}>add array</button>
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
