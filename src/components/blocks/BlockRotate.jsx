import classNames from 'classnames';
import BlockContents from '../blockParts/BlockContents';
import BlockHeader from '../blockParts/BlockHeader';
import BlockTextInput from '../blockParts/BlockTextInput';
import BlockCheckboxInput from '../blockParts/BlockCheckboxInput';
import BlockSelectInput from '../blockParts/BlockSelectInput';
import BlockInput from '../blockParts/BlockInput';

export default function BlockRotate({ className, block }) {
  const axes = [
    { value: 'x', label: <div className="tooltip-option" data-tooltip-key="rotate_axisXOption">X</div> },
    { value: 'y', label: <div className="tooltip-option" data-tooltip-key="rotate_axisYOption">Y</div> },
    { value: 'z', label: <div className="tooltip-option" data-tooltip-key="rotate_axisZOption">Z</div> },
  ];

  const center = [
    { value: 'zero', label: <div className="tooltip-option" data-tooltip-key="rotate_centerZeroOption">Slab zero</div> },
    { value: 'center', label: <div className="tooltip-option" data-tooltip-key="rotate_centerCenterOption">Box center</div> },
  ];

  const type = [
    { value: 'degree', label: <div className="tooltip-option" data-tooltip-key="rotate_typeDegreeOption">Degree</div> },
    { value: 'variation', label: <div className="tooltip-option" data-tooltip-key="rotate_typeVariationOption">Variation</div> },
    { value: 'random', label: <div className="tooltip-option" data-tooltip-key="rotate_typeRandomOption">Random</div> },
  ];

  return <div className={classNames(className, `block block--${block.type}`, { "block--is-collapsed": block.isCollapsed })}>
    <BlockHeader block={block} />

    <BlockContents block={block}>
      <div className="input-group">
        <BlockSelectInput
          path={block.path}
          dataPath={['type']}
          options={type}
          def={type[0]}
          tooltip="rotate_type"
        />
        {
          (!block.data.type || block.data.type === 'degree') ?
            <BlockInput path={block.path} dataPath={['rotation']} tooltip="rotate_rotation" /> : null
        }
        {
          (block.data.type === 'variation') ?
            <BlockTextInput path={block.path} dataPath={['rotation_variations']} tooltip="rotate_rotationVariations" /> : null
        }
        {
          (block.data.type === 'random') ?
            <>
              <BlockInput path={block.path} dataPath={['rotation_from']} tooltip="rotate_rotationFrom" />
              <BlockInput path={block.path} dataPath={['rotation_to']} tooltip="rotate_rotationTo" />
            </> : null
        }
      </div>

      <div className="input-group">
        <BlockSelectInput
          path={block.path}
          dataPath={['axis']}
          options={axes}
          def={axes[1]}
          tooltip="rotate_axis"
        />
        {
          (!block.data.axis || block.data.axis === 'y') ?
            <BlockCheckboxInput path={block.path} dataPath={['elements_only']} tooltip="rotate_elementsOnly" /> :
            null
        }
        {
          (!block.data.elements_only || (block.data.axis && block.data.axis !== 'y')) ? <BlockSelectInput
            path={block.path}
            dataPath={['center']}
            options={center}
            def={center[0]}
            key="center"
            tooltip="rotate_center"
          /> : null
        }
        {
          (!block.data.elements_only || (block.data.axis && block.data.axis !== 'y')) ?
            [
              (block.data.axis !== 'x') ?
                <BlockInput path={block.path} dataPath={['axis_offset', 'x']} key="offset.x" tooltip="rotate_offset_x" /> :
                null,
              (block.data.axis !== undefined && block.data.axis !== 'y') ?
                <BlockInput path={block.path} dataPath={['axis_offset', 'y']} key="offset.y" tooltip="rotate_offset_y" /> :
                null,
              (block.data.axis !== 'z') ?
                <BlockInput path={block.path} dataPath={['axis_offset', 'z']} key="offset.z" tooltip="rotate_offset_z" /> :
                null
            ] : null
        }

      </div>
    </BlockContents >
  </div >;
};
