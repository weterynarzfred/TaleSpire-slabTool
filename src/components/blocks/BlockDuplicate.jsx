import classNames from 'classnames';
import BlockContents from '../blockParts/BlockContents';
import BlockHeader from '../blockParts/BlockHeader';
import BlockInput from '../blockParts/BlockInput';
import BlockList from '../blockParts/BlockList';
import BlockSelectInput from '../blockParts/BlockSelectInput';

export default function BlockDuplicate({ className, block }) {
  const modifierOptions = [
    { value: 'relative', label: 'Relative' },
    { value: 'absolute', label: 'Absolute' },
  ];

  return <div className={classNames(className, `block block--${block.type}`, {
    "block--is-collapsed": block.isCollapsed,
    "block--is-error": block.isError,
  })}>
    <BlockHeader block={block} />

    <BlockContents block={block}>
      <BlockInput path={block.path} dataPath={['count']} def="1" />
      <BlockSelectInput
        path={block.path}
        dataPath={['modifiers']}
        options={modifierOptions}
        def={modifierOptions[0]}
      />
    </BlockContents>

    <BlockList path={block.path} />
  </div>;
};
