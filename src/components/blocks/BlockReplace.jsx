import classNames from 'classnames';
import BlockContents from '../blockParts/BlockContents';
import BlockHeader from '../blockParts/BlockHeader';
import BlockSelectInput from '../blockParts/BlockSelectInput';
import BlockTextInput from '../blockParts/BlockTextInput';
import tooltips from '../../data/tooltips';

export default function BlockReplace({ className, block }) {
  const fromOptions = [
    { value: 'all', label: <div data-tooltip-key="replace.fromAllOption">Everything</div> },
    { value: 'uuid', label: <div data-tooltip-key="replace.fromUuidOption">UUID</div> },
  ];
  const toOptions = [
    { value: 'uuid', label: <div data-tooltip-key="replace.toUuidOption">UUID</div> },
    { value: 'slab', label: <div data-tooltip-key="replace.toSlabOption">Slab</div> },
  ];

  return <div className={classNames(className, `block block--${block.type}`, {
    "block--is-collapsed": block.isCollapsed,
    "block--is-error": block.isError,
  })}>
    <BlockHeader block={block} />

    <BlockContents block={block}>
      <BlockSelectInput path={block.path} dataPath={['from']} options={fromOptions} def={fromOptions[0]} tooltip="replace.from" />
      {
        block.data.from === 'uuid' ?
          <BlockTextInput className="input-uuid" path={block.path} dataPath={['from_uuid']} tooltip="replace.fromUuid" /> : null
      }
      <BlockSelectInput path={block.path} dataPath={['to']} options={toOptions} def={toOptions[0]} tooltip="replace.to" />
      {
        (!block.data.to || block.data.to === 'uuid') ?
          <BlockTextInput className="input-uuid" path={block.path} dataPath={['to_uuid']} tooltip="replace.toUuid" /> : null
      }
      {
        block.data.to === 'slab' ?
          <BlockTextInput className="input-slab" path={block.path} dataPath={['to_slab']} tooltip="replace.toSlab" /> : null
      }
    </BlockContents>
  </div>;
};
