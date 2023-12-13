import classNames from 'classnames';
import BlockContents from '../blockParts/BlockContents';
import BlockHeader from '../blockParts/BlockHeader';
import BlockInput from '../blockParts/BlockInput';
import BlockSelectInput from '../blockParts/BlockSelectInput';

export default function BlockScale({ className, block }) {
  const center = [
    { value: 'zero', label: 'Slab zero' },
    { value: 'center', label: 'Box center' },
  ];

  return <div className={classNames(className, `block block--${block.type}`, { "block--is-collapsed": block.isCollapsed })}>
    <BlockHeader block={block} />

    <BlockContents block={block}>
      <div className="input-group">
        <BlockInput path={block.path} dataPath={['scale', 'x']} def={1} />
        <BlockInput path={block.path} dataPath={['scale', 'y']} def={1} />
        <BlockInput path={block.path} dataPath={['scale', 'z']} def={1} />
      </div>

      <div className="input-group">
        <BlockSelectInput
          path={block.path}
          dataPath={['center']}
          options={center}
          def={center[0]}
          key="center"
        />
        <BlockInput path={block.path} dataPath={['axis_offset', 'x']} />
        <BlockInput path={block.path} dataPath={['axis_offset', 'y']} />
        <BlockInput path={block.path} dataPath={['axis_offset', 'z']} />
      </div>
    </BlockContents>
  </div>;
};
