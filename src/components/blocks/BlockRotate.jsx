import classNames from 'classnames';
import BlockContents from '../blockParts/BlockContents';
import BlockHeader from '../blockParts/BlockHeader';
import BlockTextInput from '../blockParts/BlockTextInput';
import BlockCheckboxInput from '../blockParts/BlockCheckboxInput';
import BlockSelectInput from '../blockParts/BlockSelectInput';
import BlockInput from '../blockParts/BlockInput';
import tooltips from '../../data/tooltips.json';

export default function BlockRotate({ className, block }) {
  const axes = [
    { value: 'x', label: <div data-tooltip-id="dropdown-tooltip" data-tooltip-html={tooltips['rotate.axisXOption']}>X</div> },
    { value: 'y', label: <div data-tooltip-id="dropdown-tooltip" data-tooltip-html={tooltips['rotate.axisYOption']}>Y</div> },
    { value: 'z', label: <div data-tooltip-id="dropdown-tooltip" data-tooltip-html={tooltips['rotate.axisZOption']}>Z</div> },
  ];

  const center = [
    { value: 'zero', label: <div data-tooltip-id="dropdown-tooltip" data-tooltip-html={tooltips['rotate.centerZeroOption']}>Slab zero</div> },
    { value: 'center', label: <div data-tooltip-id="dropdown-tooltip" data-tooltip-html={tooltips['rotate.centerCenterOption']}>Box center</div> },
  ];

  const type = [
    { value: 'degree', label: <div data-tooltip-id="dropdown-tooltip" data-tooltip-html={tooltips['rotate.typeDegreeOption']}>Degree</div> },
    { value: 'variation', label: <div data-tooltip-id="dropdown-tooltip" data-tooltip-html={tooltips['rotate.typeVariationOption']}>Variation</div> },
    { value: 'random', label: <div data-tooltip-id="dropdown-tooltip" data-tooltip-html={tooltips['rotate.typeRandomOption']}>Random</div> },
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
          tooltip="rotate.type"
        />
        {
          (!block.data.type || block.data.type === 'degree') ?
            <BlockInput path={block.path} dataPath={['rotation']} tooltip="rotate.rotation" /> : null
        }
        {
          (block.data.type === 'variation') ?
            <BlockTextInput path={block.path} dataPath={['rotation_variations']} tooltip="rotate.rotationVariations" /> : null
        }
        {
          (block.data.type === 'random') ?
            <>
              <BlockInput path={block.path} dataPath={['rotation_from']} tooltip="rotate.rotationFrom" />
              <BlockInput path={block.path} dataPath={['rotation_to']} tooltip="rotate.rotationTo" />
            </> : null
        }
      </div>

      <div className="input-group">
        <BlockSelectInput
          path={block.path}
          dataPath={['axis']}
          options={axes}
          def={axes[1]}
          tooltip="rotate.axis"
        />
        {
          (!block.data.axis || block.data.axis === 'y') ?
            <BlockCheckboxInput path={block.path} dataPath={['elements_only']} tooltip="rotate.elementsOnly" /> :
            null
        }
        {
          (!block.data.elements_only || (block.data.axis && block.data.axis !== 'y')) ? <BlockSelectInput
            path={block.path}
            dataPath={['center']}
            options={center}
            def={center[0]}
            key="center"
            tooltip="rotate.center"
          /> : null
        }
        {
          (!block.data.elements_only || (block.data.axis && block.data.axis !== 'y')) ?
            [
              (block.data.axis !== 'x') ?
                <BlockInput path={block.path} dataPath={['axis_offset', 'x']} key="offset.x" tooltip="rotate.offset.x" /> :
                null,
              (block.data.axis !== undefined && block.data.axis !== 'y') ?
                <BlockInput path={block.path} dataPath={['axis_offset', 'y']} key="offset.y" tooltip="rotate.offset.y" /> :
                null,
              (block.data.axis !== 'z') ?
                <BlockInput path={block.path} dataPath={['axis_offset', 'z']} key="offset.z" tooltip="rotate.offset.z" /> :
                null
            ] : null
        }

      </div>
    </BlockContents >
  </div >;
};
