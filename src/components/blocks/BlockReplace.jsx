import classNames from 'classnames';
import BlockContents from '../blockParts/BlockContents';
import BlockHeader from '../blockParts/BlockHeader';
import BlockSelectInput from '../blockParts/BlockSelectInput';
import BlockTextInput from '../blockParts/BlockTextInput';
import BlockUuidInput from '../blockParts/BlockUuidInput';

export default function BlockReplace({ className, block }) {
  const fromOptions = [
    { value: 'all', label: <div className="tooltip-option" data-tooltip-key="replace_fromAllOption">Everything</div> },
    { value: 'uuid', label: <div className="tooltip-option" data-tooltip-key="replace_fromUuidOption">UUID</div> },
  ];
  const toOptions = [
    { value: 'uuid', label: <div className="tooltip-option" data-tooltip-key="replace_toUuidOption">UUID</div> },
    { value: 'slab', label: <div className="tooltip-option" data-tooltip-key="replace_toSlabOption">Slab</div> },
  ];

  return <div className={classNames(className, `block block--${block.type}`, {
    "block--is-collapsed": block.isCollapsed,
    "block--is-error": block.isError,
  })}>
    <BlockHeader block={block} />

    <BlockContents block={block}>
      <BlockSelectInput path={block.path} dataPath={['from']} options={fromOptions} def={fromOptions[0]} tooltip="replace_from" />
      {
        block.data.from === 'uuid' ?
          <BlockUuidInput path={block.path} dataPath={['from_uuid']} tooltip="replace_fromUuid" /> : null
      }
      <BlockSelectInput path={block.path} dataPath={['to']} options={toOptions} def={toOptions[0]} tooltip="replace_to" />
      {
        (!block.data.to || block.data.to === 'uuid') ?
          <BlockUuidInput path={block.path} dataPath={['to_uuid']} tooltip="replace_toUuid" /> : null
      }
      {
        block.data.to === 'slab' ?
          <BlockTextInput className="input-slab" path={block.path} dataPath={['to_slab']} tooltip="replace_toSlab" /> : null
      }
    </BlockContents>
  </div>;
};
