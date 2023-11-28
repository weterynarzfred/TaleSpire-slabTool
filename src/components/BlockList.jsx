import { useTrackedState, useUpdate } from './StateProvider';
import BlockArray from './blocks/BlockArray';
import BlockSlab from './blocks/BlockSlab';

export default function BlockList({ path = [] }) {
  const dispatch = useUpdate();
  const state = useTrackedState();

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
    }
  }

  return <div id="blocks">

    {blocks}
    <div className="block-controls">
      <button className="add-block-button" onClick={() => handleAddSlab('slab')}>add slab</button>
      <button className="add-block-button" onClick={() => handleAddSlab('array')}>add array</button>
    </div>

  </div>;
}
