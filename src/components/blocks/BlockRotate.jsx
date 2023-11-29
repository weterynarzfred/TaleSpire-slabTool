import BlockHeader from '../blockParts/BlockHeader';
import BlockInput from '../blockParts/BlockInput';
import BlockTextInput from '../blockParts/BlockTextInput';

export default function BlockRotate({ block }) {
  return <div className="block block--rotate">
    <BlockHeader block={block} />

    <div className="block__contents">
      <BlockInput path={block.path} dataPath={['rotation']} />
      <BlockInput path={block.path} dataPath={['elements_only']} />
      <BlockTextInput path={block.path} dataPath={['rotation_variations']} />
    </div>
  </div>;
};
