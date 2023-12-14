import classNames from 'classnames';
import BlockContents from '../blockParts/BlockContents';
import BlockHeader from '../blockParts/BlockHeader';
import BlockInput from '../blockParts/BlockInput';
import BlockSelectInput from '../blockParts/BlockSelectInput';
import tooltips from '../../data/tooltips';

export default function BlockScale({ className, block }) {
  const center = [
    { value: 'zero', label: <div data-tooltip-key="scale.centerZeroOption">Slab zero</div> },
    { value: 'center', label: <div data-tooltip-key="scale.centerCenterOption">Box center</div> },
  ];

  return <div className={classNames(className, `block block--${block.type}`, { "block--is-collapsed": block.isCollapsed })}>
    <BlockHeader block={block} />

    <BlockContents block={block}>
      <div className="input-group">
        <BlockInput path={block.path} dataPath={['scale', 'x']} def={1} tooltip="scale.scale.x" />
        <BlockInput path={block.path} dataPath={['scale', 'y']} def={1} tooltip="scale.scale.y" />
        <BlockInput path={block.path} dataPath={['scale', 'z']} def={1} tooltip="scale.scale.z" />
      </div>

      <div className="input-group">
        <BlockSelectInput
          path={block.path}
          dataPath={['center']}
          options={center}
          def={center[0]}
          key="center"
          tooltip="scale.center"
        />
        <BlockInput path={block.path} dataPath={['axis_offset', 'x']} tooltip="scale.offset.x" />
        <BlockInput path={block.path} dataPath={['axis_offset', 'y']} tooltip="scale.offset.y" />
        <BlockInput path={block.path} dataPath={['axis_offset', 'z']} tooltip="scale.offset.z" />
      </div>
    </BlockContents>
  </div>;
};
