import _ from 'lodash';
import Select from 'react-select';
import classNames from 'classnames';
import { useTrackedState, useUpdate } from '../StateProvider';
import BlockDuplicate from '../blocks/BlockDuplicate';
import BlockOffset from '../blocks/BlockOffset';
import BlockRotate from '../blocks/BlockRotate';
import BlockSlab from '../blocks/BlockSlab';
import BlockScale from '../blocks/BlockScale';
import BlockReplace from '../blocks/BlockReplace';
import BlockFilter from '../blocks/BlockFilter';
import { getBlockAtPath } from '../../lib/reducer/utils';

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

  function handleAddSlab(option) {
    dispatch({
      type: "ADD_BLOCK",
      blockType: option.value,
      path,
    });
  }

  const blockElements = [];
  const subBlocksArray = parentBlock.blocks ?
    Object.values(parentBlock.blocks).sort((a, b) => a.order - b.order) : [];
  for (let i = 0; i < subBlocksArray.length; i++) {
    const block = subBlocksArray[i];
    let className = [];
    if (i === 0) className.push('block--first');
    if (i === subBlocksArray.length - 1) className.push('block--last');
    className = classNames(className);
    if (block.type === 'slab') {
      blockElements.push(<BlockSlab
        key={block.id}
        block={block}
        className={className}
      />);
    } else if (block.type === 'duplicate') {
      blockElements.push(<BlockDuplicate
        key={block.id}
        block={block}
        className={className}
      />);
    } else if (block.type === 'offset') {
      blockElements.push(<BlockOffset
        key={block.id}
        block={block}
        className={className}
      />);
    } else if (block.type === 'rotate') {
      blockElements.push(<BlockRotate
        key={block.id}
        block={block}
        className={className}
      />);
    } else if (block.type === 'scale') {
      blockElements.push(<BlockScale
        key={block.id}
        block={block}
        className={className}
      />);
    } else if (block.type === 'replace') {
      blockElements.push(<BlockReplace
        key={block.id}
        block={block}
        className={className}
      />);
    } else if (block.type === 'filter') {
      blockElements.push(<BlockFilter
        key={block.id}
        block={block}
        className={className}
      />);
    }
  }

  const blockOptions = [];
  if (!isChildOf(['duplicate', 'filter'], state, path))
    blockOptions.push({
      value: 'slab',
      label: <div data-tooltip-key="addSlab">Slab</div>
    });
  if (!isChildOf('duplicate', state, path))
    blockOptions.push({
      value: 'duplicate',
      label: <div data-tooltip-key="addDuplicate">Duplicate</div>
    });
  blockOptions.push({
    value: 'offset',
    label: <div data-tooltip-key="addOffset">Offset</div>
  });
  blockOptions.push({
    value: 'rotate',
    label: <div data-tooltip-key="addRotate">Rotate</div>
  });
  blockOptions.push({
    value: 'scale',
    label: <div data-tooltip-key="addScale">Scale</div>
  });
  if (!isChildOf('duplicate', state, path))
    blockOptions.push({
      value: 'replace',
      label: <div data-tooltip-key="addReplace">Replace</div>
    });
  if (!isChildOf('duplicate', state, path))
    blockOptions.push({
      value: 'filter',
      label: <div data-tooltip-key="addFilter">Filter</div>
    });

  return <div className="BlockList">
    {blockElements}
    <div className="block-controls">
      <Select
        className='add-block'
        classNamePrefix='add-block'
        options={blockOptions}
        isSearchable={false}
        value={{ label: 'Add Modifier' }}
        onChange={handleAddSlab}
      />
    </div>
  </div>;
}
