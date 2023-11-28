import BlockHeader from '../BlockHeader';
import BlockInput from '../BlockInput';

export default function BlockRotate({ block }) {
  return <div className="block block--rotate">
    <BlockHeader block={block} />

    <div className="block__contents">
      <BlockInput path={block.path} dataPath={['rotation']} />
    </div>
  </div>;
};
