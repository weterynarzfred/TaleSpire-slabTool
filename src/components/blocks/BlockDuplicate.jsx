import classNames from 'classnames';
import BlockContents from '../blockParts/BlockContents';
import BlockHeader from '../blockParts/BlockHeader';
import BlockInput from '../blockParts/BlockInput';
import BlockList from '../blockParts/BlockList';
import BlockSelectInput from '../blockParts/BlockSelectInput';
import BlockTextInput from "../blockParts/BlockTextInput";

export default function BlockDuplicate({ className, block, scope = {} }) {
  const modifierOptions = [
    { value: 'relative', label: <div className="tooltip-option" data-tooltip-key="duplicate_modifiersRelativeOption">Relative</div> },
    { value: 'absolute', label: <div className="tooltip-option" data-tooltip-key="duplicate_modifiersAbsoluteOption">Absolute</div> },
  ];

  let depth = 0;
  while (scope[`iter${depth}`] !== undefined) {
    depth++;
  }
  const defaultIterName = `iter${depth}`;

  return (
    <div className={classNames(className, `block block--${block.type}`, {
      "block--is-collapsed": block.isCollapsed,
      "block--is-error": block.isError,
    })}>
      <BlockHeader block={block} />

      <BlockContents block={block}>
        <BlockTextInput
          path={block.path}
          dataPath={['iterName']}
          placeholder={defaultIterName}
          tooltip="duplicate_iter_name"
        />
        <BlockInput
          path={block.path}
          dataPath={['count']}
          def="1"
          tooltip="duplicate_count"
        />
        <BlockSelectInput
          path={block.path}
          dataPath={['modifiers']}
          options={modifierOptions}
          def={modifierOptions[0]}
          tooltip="duplicate_modifiers"
        />
      </BlockContents>

      <BlockList path={block.path} scope={{
        ...scope,
        [`iter${Object.keys(scope).filter(k => k.startsWith("iter")).length}`]: 0
      }} />
    </div>
  );
}
