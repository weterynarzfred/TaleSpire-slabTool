import { useTrackedState } from './StateProvider';
import Results from './Results';
import BlockSlab from './BlockSlab';

export default function BlockList({ path = [] }) {
  const state = useTrackedState();

  const blocks = [];
  for (const id in state.blocks) {
    const block = state.blocks[id];
    if (block.type === 'slab') {
      blocks.push(<BlockSlab key={id} data={block.data} path={[...path, id]} />);
    }
  }

  return <div id="blocks">

    <Results />
    {blocks}

  </div>;
}
