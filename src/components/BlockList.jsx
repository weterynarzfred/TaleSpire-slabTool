import { useTrackedState, useUpdate } from './StateProvider';
import BlockSlab from './blocks/BlockSlab';

export default function BlockList({ path = [] }) {
  const dispatch = useUpdate();
  const state = useTrackedState();

  function handleAddSlab() {
    dispatch({
      type: "ADD_BLOCK",
      blockType: 'slab',
      path,
    });
  }

  const blocks = [];
  for (const id in state.blocks) {
    const block = state.blocks[id];
    if (block.type === 'slab') {
      blocks.push(<BlockSlab key={id} data={block.data} path={[...path, id]} />);
    }
  }

  return <div id="blocks">

    {blocks}
    <div className="block-controls">
      <button className="add-slab-button" onClick={handleAddSlab}>add slab</button>
    </div>

  </div>;
}
