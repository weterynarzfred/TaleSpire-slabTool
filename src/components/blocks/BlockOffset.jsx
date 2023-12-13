import classNames from 'classnames';
import BlockContents from '../blockParts/BlockContents';
import BlockHeader from '../blockParts/BlockHeader';
import BlockInput from '../blockParts/BlockInput';
import BlockCheckboxInput from '../blockParts/BlockCheckboxInput';

export default function BlockOffset({ className, block }) {
  return <div className={classNames(className, `block block--${block.type}`, { "block--is-collapsed": block.isCollapsed })}>
    <BlockHeader block={block} />

    <BlockContents block={block}>
      <BlockInput path={block.path} dataPath={['offset', 'x']} />
      <BlockInput path={block.path} dataPath={['offset', 'y']} />
      <BlockInput path={block.path} dataPath={['offset', 'z']} />
      <BlockCheckboxInput path={block.path} dataPath={['is_random']} />
    </BlockContents>

    <div className="block__sub-blocks">
      <div className="sub-block-list"></div>
      <div className="sub-block-controls"></div>
    </div>
  </div>;
}
