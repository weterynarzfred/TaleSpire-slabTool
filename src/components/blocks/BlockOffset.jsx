import classNames from 'classnames';
import BlockContents from '../blockParts/BlockContents';
import BlockHeader from '../blockParts/BlockHeader';
import BlockInput from '../blockParts/BlockInput';

export default function BlockOffset({ block }) {

  return <div className={classNames(`block block--${block.type}`, { "block--is-collapsed": block.isCollapsed })}>
    <BlockHeader block={block} />

    <BlockContents block={block}>
      <BlockInput path={block.path} dataPath={['offset', 'x']} />
      <BlockInput path={block.path} dataPath={['offset', 'y']} />
      <BlockInput path={block.path} dataPath={['offset', 'z']} />
      <BlockInput path={block.path} dataPath={['isRandom']} />
    </BlockContents>

    <div className="block__sub-blocks">
      <div className="sub-block-list"></div>
      <div className="sub-block-controls"></div>
    </div>
  </div>;
}
