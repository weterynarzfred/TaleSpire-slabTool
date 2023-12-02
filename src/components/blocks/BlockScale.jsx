import classNames from 'classnames';
import BlockContents from '../blockParts/BlockContents';
import BlockHeader from '../blockParts/BlockHeader';
import BlockInput from '../blockParts/BlockInput';
import BlockSelectInput from '../blockParts/BlockSelectInput';

export default function BlockScale({ block }) {
  const options = [
    { value: 'x', label: 'X' },
    { value: 'y', label: 'Y' },
    { value: 'z', label: 'Z' },
  ];

  return <div className={classNames(`block block--${block.type}`, { "block--is-collapsed": block.isCollapsed })}>
    <BlockHeader block={block} />

    <BlockContents block={block}>
      <BlockSelectInput path={block.path} dataPath={['axis']} options={options} def={options[0]} />
      <BlockInput path={block.path} dataPath={['scale']} def={1} />
    </BlockContents>
  </div>;
};
