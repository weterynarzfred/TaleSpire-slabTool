import classNames from 'classnames';
import BlockContents from '../blockParts/BlockContents';
import BlockHeader from '../blockParts/BlockHeader';
import BlockInput from '../blockParts/BlockInput';

export default function BlockArray({ block }) {
  return <div className={classNames(`block block--${block.type}`, { "block--is-collapsed": block.isCollapsed })}>
    <BlockHeader block={block} />

    <BlockContents block={block}>
      <BlockInput path={block.path} dataPath={['offset', 'x']} />
      <BlockInput path={block.path} dataPath={['offset', 'y']} />
      <BlockInput path={block.path} dataPath={['offset', 'z']} />
      <BlockInput path={block.path} dataPath={['offset', 'rotation']} />
      <BlockInput path={block.path} dataPath={['count']} def="1" />
    </BlockContents>
  </div>;
};
