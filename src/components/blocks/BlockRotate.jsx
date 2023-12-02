import classNames from 'classnames';
import BlockContents from '../blockParts/BlockContents';
import BlockHeader from '../blockParts/BlockHeader';
import BlockInput from '../blockParts/BlockInput';
import BlockTextInput from '../blockParts/BlockTextInput';
import BlockCheckboxInput from '../blockParts/BlockCheckboxInput';

export default function BlockRotate({ block }) {
  return <div className={classNames(`block block--${block.type}`, { "block--is-collapsed": block.isCollapsed })}>
    <BlockHeader block={block} />

    <BlockContents block={block}>
      <BlockInput path={block.path} dataPath={['rotation']} />
      <BlockCheckboxInput path={block.path} dataPath={['elements_only']} />
      <BlockTextInput path={block.path} dataPath={['rotation_variations']} />
    </BlockContents>
  </div>;
};
