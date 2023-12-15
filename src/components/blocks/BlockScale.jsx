import classNames from 'classnames';
import BlockContents from '../blockParts/BlockContents';
import BlockHeader from '../blockParts/BlockHeader';
import BlockInput from '../blockParts/BlockInput';
import BlockSelectInput from '../blockParts/BlockSelectInput';

export default function BlockScale({ className, block }) {
  const center = [
    { value: 'zero', label: <div data-tooltip-key="scale_centerZeroOption">Slab zero</div> },
    { value: 'center', label: <div data-tooltip-key="scale_centerCenterOption">Box center</div> },
  ];

  return <div className={classNames(className, `block block--${block.type}`, { "block--is-collapsed": block.isCollapsed })}>
    <BlockHeader block={block} />

    <BlockContents block={block}>
      <div className="input-group">
        <BlockInput path={block.path} dataPath={['scale', 'x']} def={1} tooltip="scale_scale_x" />
        <BlockInput path={block.path} dataPath={['scale', 'y']} def={1} tooltip="scale_scale_y" />
        <BlockInput path={block.path} dataPath={['scale', 'z']} def={1} tooltip="scale_scale_z" />
      </div>

      <div className="input-group">
        <BlockSelectInput
          path={block.path}
          dataPath={['center']}
          options={center}
          def={center[0]}
          key="center"
          tooltip="scale_center"
        />
        <BlockInput path={block.path} dataPath={['axis_offset', 'x']} tooltip="scale_offset_x" />
        <BlockInput path={block.path} dataPath={['axis_offset', 'y']} tooltip="scale_offset_y" />
        <BlockInput path={block.path} dataPath={['axis_offset', 'z']} tooltip="scale_offset_z" />
      </div>
    </BlockContents>
  </div>;
};
