import classNames from 'classnames';
import BlockContents from '../blockParts/BlockContents';
import BlockHeader from '../blockParts/BlockHeader';
import BlockTextInput from '../blockParts/BlockTextInput';
import BlockCheckboxInput from '../blockParts/BlockCheckboxInput';
import BlockSelectInput from '../blockParts/BlockSelectInput';
import BlockInput from '../blockParts/BlockInput';

export default function BlockRotate({ block }) {
  const axes = [
    { value: 'x', label: 'X' },
    { value: 'y', label: 'Y' },
    { value: 'z', label: 'Z' },
  ];

  const center = [
    { value: 'zero', label: 'Slab zero' },
    { value: 'center', label: 'Box center' },
  ];

  return <div className={classNames(`block block--${block.type}`, { "block--is-collapsed": block.isCollapsed })}>
    <BlockHeader block={block} />

    <BlockContents block={block}>
      <div className="input-group">
        {/* if comma separated list, picks one of the values at random */}
        <BlockTextInput path={block.path} dataPath={['rotation_variations']} />
        <BlockInput path={block.path} dataPath={['rotation_from']} />
        <BlockInput path={block.path} dataPath={['rotation_to']} />
      </div>

      <div className="input-group">
        <BlockSelectInput
          path={block.path}
          dataPath={['axis']}
          options={axes}
          def={axes[1]}
        />
        <BlockSelectInput
          path={block.path}
          dataPath={['center']}
          options={center}
          def={center[0]}
        />
        {
          (block.data.axis !== 'x') ?
            <BlockInput path={block.path} dataPath={['axis_offset', 'x']} /> :
            null
        }
        {
          (block.data.axis !== undefined && block.data.axis !== 'y') ?
            <BlockInput path={block.path} dataPath={['axis_offset', 'y']} /> :
            null
        }
        {
          (block.data.axis !== 'z') ?
            <BlockInput path={block.path} dataPath={['axis_offset', 'z']} /> :
            null
        }
        {
          (!block.data.axis || block.data.axis === 'y') ?
            <BlockCheckboxInput path={block.path} dataPath={['elements_only']} /> :
            null
        }
      </div>
    </BlockContents >
  </div >;
};
