import BlockHeader from '../blockParts/BlockHeader';
import BlockInput from '../blockParts/BlockInput';
import BlockSelectInput from '../blockParts/BlockSelectInput';

export default function BlockScale({ block }) {
  const options = [
    { value: 'x', label: 'X' },
    { value: 'y', label: 'Y' },
    { value: 'z', label: 'Z' },
  ];

  return <div className="block block--scale">
    <BlockHeader block={block} />

    <div className="block__contents">
      <BlockSelectInput path={block.path} dataPath={['axis']} options={options} def={options[0]} />
      <BlockInput path={block.path} dataPath={['scale']} def={1} />
    </div>
  </div>;
};
