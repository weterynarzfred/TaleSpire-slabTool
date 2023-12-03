import classNames from 'classnames';
import BlockContents from '../blockParts/BlockContents';
import BlockHeader from '../blockParts/BlockHeader';
import BlockInput from '../blockParts/BlockInput';
import BlockList from '../blockParts/BlockList';

export default function BlockDuplicate({ block }) {
  return <div className={classNames(`block block--${block.type}`, {
    "block--is-collapsed": block.isCollapsed,
    "block--is-error": block.isError,
  })}>
    <BlockHeader block={block} />

    <BlockContents block={block}>
      <BlockInput path={block.path} dataPath={['count']} def="1" />
    </BlockContents>

    <BlockList path={block.path} />
  </div>;
};
