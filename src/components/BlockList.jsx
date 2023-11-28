import { useTrackedState, useUpdate } from './StateProvider';
import BlockArray from './blocks/BlockArray';
import BlockOffset from './blocks/BlockOffset';
import BlockRotate from './blocks/BlockRotate';
import BlockSlab from './blocks/BlockSlab';

export default function BlockList({ path = [] }) {
  const state = useTrackedState();
  const dispatch = useUpdate();

  function handleAddSlab(blockType) {
    dispatch({
      type: "ADD_BLOCK",
      blockType,
      path,
    });
  }

  const blocks = [];
  for (const id in state.blocks) {
    const block = state.blocks[id];
    if (block.type === 'slab') {
      blocks.push(<BlockSlab key={id} block={block} />);
    } else if (block.type === 'array') {
      blocks.push(<BlockArray key={id} block={block} />);
    } else if (block.type === 'offset') {
      blocks.push(<BlockOffset key={id} block={block} />);
    } else if (block.type === 'rotate') {
      blocks.push(<BlockRotate key={id} block={block} />);
    }
  }

  return <div id="blocks">

    {blocks}
    <div className="block-controls">
      <button className="add-block-button" onClick={() => handleAddSlab('slab')}>add slab</button>
      <button className="add-block-button" onClick={() => handleAddSlab('array')}>add array</button>
      <button className="add-block-button" onClick={() => handleAddSlab('offset')}>add offset</button>
      <button className="add-block-button" onClick={() => handleAddSlab('rotate')}>add rotate</button>
    </div>

  </div>;
}
