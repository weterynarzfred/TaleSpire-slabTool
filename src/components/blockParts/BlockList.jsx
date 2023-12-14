import _ from 'lodash';
import { useTrackedState, useUpdate } from '../StateProvider';
import BlockDuplicate from '../blocks/BlockDuplicate';
import BlockOffset from '../blocks/BlockOffset';
import BlockRotate from '../blocks/BlockRotate';
import BlockSlab from '../blocks/BlockSlab';
import { getBlockAtPath } from '../../lib/reducer/utils';
import BlockScale from '../blocks/BlockScale';
import BlockReplace from '../blocks/BlockReplace';
import classNames from 'classnames';
import BlockFilter from '../blocks/BlockFilter';

function isChildOf(type, state, path) {
  type = Array.isArray(type) ? type : [type];
  let currentPath = [];
  for (let i = 0; i < path.length; i++) {
    currentPath.push(path[i]);
    const currentBlock = getBlockAtPath(state, currentPath);
    if (type.includes(currentBlock.type)) return true;
  }

  return false;
};

export default function BlockList({ path = [] }) {
  const state = useTrackedState();
  const dispatch = useUpdate();
  const parentBlock = getBlockAtPath(state, path);
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
    const subBlocksArray = parentBlock.blocks ? Object.values(parentBlock.blocks).sort((a, b) => a.order - b.order) : [];
    for (let i = 0; i < subBlocksArray.length; i++) {
      const block = subBlocksArray[i];
      let className = [];
      if (i === 0) className.push('block--first');
      if (i === subBlocksArray.length - 1) className.push('block--last');
      className = classNames(className);
      if (block.type === 'slab') {
        blockElements.push(<BlockSlab key={block.id} block={block} className={className} />);
      } else if (block.type === 'duplicate') {
        blockElements.push(<BlockDuplicate key={block.id} block={block} className={className} />);
      } else if (block.type === 'offset') {
        blockElements.push(<BlockOffset key={block.id} block={block} className={className} />);
      } else if (block.type === 'rotate') {
        blockElements.push(<BlockRotate key={block.id} block={block} className={className} />);
      } else if (block.type === 'scale') {
        blockElements.push(<BlockScale key={block.id} block={block} className={className} />);
      } else if (block.type === 'replace') {
        blockElements.push(<BlockReplace key={block.id} block={block} className={className} />);
      } else if (block.type === 'filter') {
        blockElements.push(<BlockFilter key={block.id} block={block} className={className} />);
      }
    }
  }

  return <div className="BlockList">
    {parentBlock.isSubListHidden ? null :
      <>
        {blockElements}
        <div className="block-controls">
          {
            isChildOf(['duplicate', 'filter'], state, path) ? null :
              <button className="add-block-button" onClick={() => handleAddSlab('slab')}>add slab</button>
          }
          {
            isChildOf('duplicate', state, path) ? null :
              <button className="add-block-button" onClick={() => handleAddSlab('duplicate')}>add duplicate</button>
          }
          <button className="add-block-button" onClick={() => handleAddSlab('offset')}>add offset</button>
          <button className="add-block-button" onClick={() => handleAddSlab('rotate')}>add rotate</button>
          <button className="add-block-button" onClick={() => handleAddSlab('scale')}>add scale</button>
          {
            isChildOf('duplicate', state, path) ? null :
              <button className="add-block-button" onClick={() => handleAddSlab('replace')}>add replace</button>
          }
          {
            isChildOf('duplicate', state, path) ? null :
              <button className="add-block-button" onClick={() => handleAddSlab('filter')}>add filter</button>
          }
        </div>
      </>
    }
    {path.length > 0 ? <button
      className={classNames("BlockList__hide", { "BlockList__hide--hidden": parentBlock.isSubListHidden })}
      onClick={() => dispatch({
        type: "SET_BLOCK_PROPERTY",
        path,
        key: 'isSubListHidden',
        value: !parentBlock.isSubListHidden
      })}
    >{parentBlock.isSubListHidden ? `show sub-blocks (${hasSubBlocks ? Object.keys(parentBlock.blocks).length : 0})` : 'hide'}</button> : null}
  </div>;
}
