import classNames from 'classnames';
import BlockContents from '../blockParts/BlockContents';
import BlockHeader from '../blockParts/BlockHeader';
import BlockList from '../blockParts/BlockList';
import BlockInput from '../blockParts/BlockInput';
import BlockCheckboxInput from '../blockParts/BlockCheckboxInput';
import BlockUuidInput from '../blockParts/BlockUuidInput';

export default function BlockFilter({ className, block }) {
  return <div className={classNames(className, `block block--${block.type}`, {
    "block--is-collapsed": block.isCollapsed,
    "block--is-error": block.isError,
  })}>
    <BlockHeader block={block} />

    <BlockContents block={block}>
      <BlockInput path={block.path} dataPath={['percentage']} def="1" tooltip="filter.percentage" />
      <BlockUuidInput path={block.path} dataPath={['uuid']} tooltip="filter.uuid" />
      <BlockInput path={block.path} dataPath={['min_distance']} tooltip="filter.minDistance" />

      <BlockCheckboxInput path={block.path} dataPath={['delete_selected']} tooltip="filter.deleteSelected" />
    </BlockContents>

    {block.data.delete_selected === true ? null :
      <BlockList path={block.path} />
    }
  </div>;
};
