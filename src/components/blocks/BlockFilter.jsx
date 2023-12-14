import classNames from 'classnames';
import BlockContents from '../blockParts/BlockContents';
import BlockHeader from '../blockParts/BlockHeader';
import BlockList from '../blockParts/BlockList';
import BlockInput from '../blockParts/BlockInput';
import BlockTextInput from '../blockParts/BlockTextInput';
import BlockCheckboxInput from '../blockParts/BlockCheckboxInput';

export default function BlockFilter({ className, block }) {
  return <div className={classNames(className, `block block--${block.type}`, {
    "block--is-collapsed": block.isCollapsed,
    "block--is-error": block.isError,
  })}>
    <BlockHeader block={block} />

    <BlockContents block={block}>
      <BlockInput path={block.path} dataPath={['percentage']} def="1" />
      {/* if not empty, selects only objects with the given uuid */}
      <BlockTextInput className="input-uuid" path={block.path} dataPath={['uuid']} />
      {/* if above zero, selects only objects closer to each other than the given value */}
      <BlockInput path={block.path} dataPath={['min_distance']} />

      <BlockCheckboxInput path={block.path} dataPath={['delete_selected']} />
    </BlockContents>

    {block.data.delete_selected === true ? null :
      <BlockList path={block.path} />
    }
  </div>;
};
