import BlockHeader from '../BlockHeader';
import BlockInput from '../BlockInput';

export default function BlockOffset({ block }) {

  return <div className="block block--offset">
    <BlockHeader block={block} />

    <div className="block__contents">
      <BlockInput path={block.path} dataPath={['offset', 'x']} />
      <BlockInput path={block.path} dataPath={['offset', 'y']} />
      <BlockInput path={block.path} dataPath={['offset', 'z']} />
      <BlockInput path={block.path} dataPath={['isRandom']} />
    </div>

    <div className="block__sub-blocks">
      <div className="sub-block-list"></div>
      <div className="sub-block-controls"></div>
    </div>
  </div>;
}
