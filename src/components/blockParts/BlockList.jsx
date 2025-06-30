import _ from 'lodash';
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
import BlockGroup from "../blocks/BlockGroup";

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

  function handleAddBlock(blockType) {
    dispatch({
      type: "ADD_BLOCK",
      blockType,
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
    if (block.type === 'group') {
      blockElements.push(<BlockGroup
        key={block.id}
        block={block}
        className={className}
      />);
    } else if (block.type === 'slab') {
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
  if (!isChildOf(['group', 'duplicate', 'filter', 'slab'], state, path)) {
    blockOptions.push(
      < button className="add-block" key='group' data-tooltip-key="addGroup" onClick={() => handleAddBlock('group')}> Group</button >
    );
  }
  if (!isChildOf(['duplicate', 'filter', 'slab'], state, path)) {
    blockOptions.push(
      <button className="add-block" key='slab' data-tooltip-key="addSlab" onClick={() => handleAddBlock('slab')}>Slab</button>
    );
  }
  blockOptions.push(
    < button className="add-block" key='duplicate' data-tooltip-key="addDuplicate" onClick={() => handleAddBlock('duplicate')}> Duplicate</button >
  );
  blockOptions.push(
    < button className="add-block" key='offset' data-tooltip-key="addOffset" onClick={() => handleAddBlock('offset')}> Offset</button >
  );
  blockOptions.push(
    < button className="add-block" key='rotate' data-tooltip-key="addRotate" onClick={() => handleAddBlock('rotate')}> Rotate</button >
  );
  blockOptions.push(
    < button className="add-block" key='scale' data-tooltip-key="addScale" onClick={() => handleAddBlock('scale')}> Scale</button >
  );
  blockOptions.push(
    < button className="add-block" key='replace' data-tooltip-key="addReplace" onClick={() => handleAddBlock('replace')}> Replace</button >
  );
  blockOptions.push(
    < button className="add-block" key='filter' data-tooltip-key="addFilter" onClick={() => handleAddBlock('filter')}> Filter</button >
  );

  return <div className="BlockList">
    {blockElements}
    <div className="block-controls">
      {blockOptions}
    </div>
  </div>;
}

export {
  isChildOf,
};
