import classNames from 'classnames';
import BlockHeader from '../blockParts/BlockHeader';
import BlockList from '../blockParts/BlockList';
import BlockContents from '../blockParts/BlockContents';

export default function BlockGroup({ className, block }) {

  return <div className={classNames(className, `block block--${block.type}`, {
    "block--is-collapsed": block.isCollapsed,
  })}>
    <BlockHeader block={block} />

    <BlockContents block={block}>
    </BlockContents>

    <BlockList path={block.path} />
  </div>;
};
