import classNames from 'classnames';
import BlockContents from '../blockParts/BlockContents';
import BlockHeader from '../blockParts/BlockHeader';
import BlockTextInput from '../blockParts/BlockTextInput';
import BlockCheckboxInput from '../blockParts/BlockCheckboxInput';
import BlockSelectInput from '../blockParts/BlockSelectInput';
import BlockInput from '../blockParts/BlockInput';

export default function BlockRotate({ className, block }) {
  const axes = [
    { value: 'x', label: 'X' },
    { value: 'y', label: 'Y' },
    { value: 'z', label: 'Z' },
  ];

  const center = [
    { value: 'zero', label: 'Slab zero' },
    { value: 'center', label: 'Box center' },
  ];

  return <div className={classNames(className, `block block--${block.type}`, { "block--is-collapsed": block.isCollapsed })}>
    <BlockHeader block={block} />

    <BlockContents block={block}>
      <div className="input-group">
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
        {
          (!block.data.axis || block.data.axis === 'y') ?
            <BlockCheckboxInput path={block.path} dataPath={['elements_only']} /> :
            null
        }
        {
          (!block.data.elements_only || (block.data.axis && block.data.axis !== 'y')) ? <BlockSelectInput
            path={block.path}
            dataPath={['center']}
            options={center}
            def={center[0]}
            key="center"
          /> : null
        }
        {
          (!block.data.elements_only || (block.data.axis && block.data.axis !== 'y')) ?
            [
              (block.data.axis !== 'x') ?
                <BlockInput path={block.path} dataPath={['axis_offset', 'x']} key="offset.x" /> :
                null,
              (block.data.axis !== undefined && block.data.axis !== 'y') ?
                <BlockInput path={block.path} dataPath={['axis_offset', 'y']} key="offset.y" /> :
                null,
              (block.data.axis !== 'z') ?
                <BlockInput path={block.path} dataPath={['axis_offset', 'z']} key="offset.z" /> :
                null
            ] : null
        }

      </div>
    </BlockContents >
  </div >;
};
