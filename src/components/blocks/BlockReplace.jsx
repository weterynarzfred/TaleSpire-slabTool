import classNames from 'classnames';
import BlockContents from '../blockParts/BlockContents';
import BlockHeader from '../blockParts/BlockHeader';
import BlockSelectInput from '../blockParts/BlockSelectInput';
import BlockTextInput from '../blockParts/BlockTextInput';

export default function BlockReplace({ className, block }) {
  const fromOptions = [
    { value: 'all', label: 'Everything' },
    { value: 'uuid', label: 'UUID' },
  ];
  const toOptions = [
    { value: 'uuid', label: 'UUID' },
    { value: 'slab', label: 'Slab' },
  ];

  return <div className={classNames(className, `block block--${block.type}`, {
    "block--is-collapsed": block.isCollapsed,
    "block--is-error": block.isError,
  })}>
    <BlockHeader block={block} />

    <BlockContents block={block}>
      <BlockSelectInput path={block.path} dataPath={['from']} options={fromOptions} def={fromOptions[0]} />
      {
        block.data.from === 'uuid' ?
          <BlockTextInput className="input-uuid" path={block.path} dataPath={['from_uuid']} /> : null
      }
      <BlockSelectInput path={block.path} dataPath={['to']} options={toOptions} def={toOptions[0]} />
      {
        (!block.data.to || block.data.to === 'uuid') ?
          <BlockTextInput className="input-uuid" path={block.path} dataPath={['to_uuid']} /> : null
      }
      {
        block.data.to === 'slab' ?
          <BlockTextInput className="input-slab" path={block.path} dataPath={['to_slab']} /> : null
      }
    </BlockContents>
  </div>;
};
