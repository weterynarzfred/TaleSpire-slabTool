import BlockHeader from '../blockParts/BlockHeader';
import BlockInput from '../blockParts/BlockInput';

export default function BlockArray({ block }) {
  return <div className="block block--array">
    <BlockHeader block={block} />

    <div className="block__contents">
      <BlockInput path={block.path} dataPath={['offset', 'x']} />
      <BlockInput path={block.path} dataPath={['offset', 'y']} />
      <BlockInput path={block.path} dataPath={['offset', 'z']} />
      <BlockInput path={block.path} dataPath={['offset', 'rotation']} />
      <BlockInput path={block.path} dataPath={['count']} def="1" />
    </div>
  </div>;
};
