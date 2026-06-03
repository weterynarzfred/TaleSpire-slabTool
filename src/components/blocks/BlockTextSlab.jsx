import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import Layout from '../../lib/Layout';
import { decodeSlab } from '../../lib/encoding';
import readSlab from '../../lib/readSlab';
import BlockHeader from '../blockParts/BlockHeader';
import BlockList from '../blockParts/BlockList';
import BlockContents from '../blockParts/BlockContents';
import BlockInput from '../blockParts/BlockInput';
import { useTrackedState, useUpdate } from '../StateProvider';

const DEFAULT_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?-_';

let textChangeTimeout;

function plainClone(value) {
  return JSON.parse(JSON.stringify(value ?? []));
}

function uniqueCharacters(value) {
  return [...new Set([...String(value)])].join('');
}

function TextSlabTextInput({ block, changeData }) {
  const [inputValue, setInputValue] = useState(block.data.text || '');
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;

    if (el) {
      el.style.height = 'auto';
      const minHeight = 10 * 10;
      el.style.height = Math.max(el.scrollHeight + 16, minHeight) + 'px';
    }
  }, [inputValue]);

  useEffect(() => {
    clearTimeout(textChangeTimeout);

    textChangeTimeout = setTimeout(() => {
      if ((block.data.text || '') !== inputValue) {
        changeData(['text'], inputValue);
      }
    }, 500);

    return () => clearTimeout(textChangeTimeout);
  }, [inputValue]);

  useEffect(() => {
    setInputValue(block.data.text || '');
  }, [block.data.text]);

  return (
    <div
      className="TemplateHeader text-slab-text-input default-tooltip-anchor"
      data-tooltip-key="textSlab_text"
    >
      <textarea
        ref={textareaRef}
        value={inputValue}
        placeholder={'HELLO\nWORLD'}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  );
}

export default function BlockTextSlab({ className, block }) {
  const state = useTrackedState();
  const dispatch = useUpdate();

  const [letterInputs, setLetterInputs] = useState({});
  const [letterErrors, setLetterErrors] = useState({});

  useEffect(() => {
    const next = {};
    const letterSlabs = block.data.letter_slabs || {};

    for (const letter of Object.keys(letterSlabs)) {
      try {
        next[letter] = new Layout(
          plainClone(letterSlabs[letter])
        ).base64;
      } catch {
        next[letter] = '';
      }
    }

    setLetterInputs(next);
  }, [state.stateReplacementIndex, block.data.letter_slabs]);

  function changeData(dataPath, value) {
    dispatch({
      type: 'CHANGE_DATA',
      path: block.path,
      dataPath,
      value,
    });
  }

  function handleLettersChange(value) {
    const nextLetters = uniqueCharacters(value);

    const nextLetterSlabs = plainClone(
      block.data.letter_slabs || {}
    );

    const nextLetterSettings = plainClone(
      block.data.letter_settings || {}
    );

    for (const letter of Object.keys(nextLetterSlabs)) {
      if (!nextLetters.includes(letter)) {
        delete nextLetterSlabs[letter];
      }
    }

    for (const letter of Object.keys(nextLetterSettings)) {
      if (!nextLetters.includes(letter)) {
        delete nextLetterSettings[letter];
      }
    }

    changeData(['letters'], nextLetters);
    changeData(['letter_slabs'], nextLetterSlabs);
    changeData(['letter_settings'], nextLetterSettings);
  }

  function handleLetterSlabChange(letter, value) {
    setLetterInputs((prev) => ({
      ...prev,
      [letter]: value,
    }));

    const nextLetterSlabs = plainClone(
      block.data.letter_slabs || {}
    );

    if (!value.trim()) {
      delete nextLetterSlabs[letter];

      setLetterErrors((prev) => ({
        ...prev,
        [letter]: undefined,
      }));

      changeData(['letter_slabs'], nextLetterSlabs);
      return;
    }

    try {
      const decodedSlab = decodeSlab(value);
      const layouts = readSlab(decodedSlab);

      nextLetterSlabs[letter] = new Layout(
        plainClone(layouts)
      ).layouts;

      setLetterErrors((prev) => ({
        ...prev,
        [letter]: undefined,
      }));

      changeData(['letter_slabs'], nextLetterSlabs);
    } catch (error) {
      setLetterErrors((prev) => ({
        ...prev,
        [letter]: 'Invalid slab',
      }));

      console.warn(
        `Invalid slab pasted for letter "${letter}"`,
        error
      );
    }
  }

  const letters = uniqueCharacters(
    block.data.letters || DEFAULT_LETTERS
  );

  return (
    <div
      className={classNames(
        className,
        `block block--${block.type}`,
        {
          'block--is-collapsed': block.isCollapsed,
          'block--is-error': block.isError,
        }
      )}
    >
      <BlockHeader block={block} />

      <BlockContents block={block}>
        <TextSlabTextInput
            block={block}
            changeData={changeData}
            />

            <div className="BlockInput text-slab-letters-input">
            <label>
                <div
                className="label default-tooltip-anchor"
                data-tooltip-key="textSlab_letters"
                >
                letters:
                </div>

                <input
                type="text"
                value={letters}
                onChange={(e) => handleLettersChange(e.target.value)}
                spellCheck={false}
                className="default-tooltip-anchor"
                data-tooltip-key="textSlab_letters"
                />
            </label>
            </div>

            <BlockInput
                path={block.path}
                dataPath={['line_height']}
                def="1"
                tooltip="textSlab_lineHeight"
                />

                <BlockInput
                path={block.path}
                dataPath={['global_letter_width']}
                def="0.5"
                tooltip="textSlab_globalLetterWidth"
                />

                <BlockInput
                path={block.path}
                dataPath={['space_width']}
                def=""
                tooltip="textSlab_spaceWidth"
            />

        <div className="text-slab-letter-list">
          <div className="text-slab-letter-row text-slab-letter-row--header">
            <div>Letter</div>
            <div>Paste slab</div>
            <div>Width</div>
            <div>X</div>
            <div>Z</div>
          </div>

          {[...letters].map((letter) => (
            <div
              className="text-slab-letter-row"
              key={letter}
            >
              <div className="text-slab-letter-label">
                {letter === ' ' ? 'space' : letter}
              </div>

              <div>
                <input
                  type="text"
                  spellCheck={false}
                  placeholder={`Paste slab for "${letter}"`}
                  value={letterInputs[letter] || ''}
                  onChange={(e) =>
                    handleLetterSlabChange(
                      letter,
                      e.target.value
                    )
                  }
                />

                {letterErrors[letter] && (
                  <div className="text-slab-letter-error">
                    {letterErrors[letter]}
                  </div>
                )}
              </div>

              <BlockInput
                path={block.path}
                dataPath={[
                  'letter_settings',
                  letter,
                  'width',
                ]}
                def=""
                tooltip="textSlab_individualLetterWidth"
              />

              <BlockInput
                path={block.path}
                dataPath={[
                  'letter_settings',
                  letter,
                  'x_offset',
                ]}
                def="0"
                tooltip="textSlab_individualXOffset"
              />

              <BlockInput
                path={block.path}
                dataPath={[
                  'letter_settings',
                  letter,
                  'z_offset',
                ]}
                def="0"
                tooltip="textSlab_individualZOffset"
              />
            </div>
          ))}
        </div>
      </BlockContents>

      <BlockList path={block.path} />
    </div>
  );
}