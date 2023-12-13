import classNames from 'classnames';
import BlockContents from '../blockParts/BlockContents';
import BlockHeader from '../blockParts/BlockHeader';
import BlockInput from '../blockParts/BlockInput';

export default function BlockScale({ className, block }) {
  return <div className={classNames(className, `block block--${block.type}`, { "block--is-collapsed": block.isCollapsed })}>
    <BlockHeader block={block} />

    <BlockContents block={block}>
      <BlockInput path={block.path} dataPath={['scale', 'x']} def={1} />
      <BlockInput path={block.path} dataPath={['scale', 'y']} def={1} />
      <BlockInput path={block.path} dataPath={['scale', 'z']} def={1} />
    </BlockContents>
  </div>;
};
