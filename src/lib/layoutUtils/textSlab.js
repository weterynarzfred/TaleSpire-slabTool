import Layout from '../Layout';
import parseInput from '../parseInput';

function plainClone(value) {
  return JSON.parse(JSON.stringify(value ?? []));
}

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function shouldUseCaseSensitiveLetters(data, char) {
  const letters = String(data.letters || '');

  const upper = char.toUpperCase?.();
  const lower = char.toLowerCase?.();

  if (!upper || !lower || upper === lower) {
    return false;
  }

  return letters.includes(upper) && letters.includes(lower);
}

function resolveLetterKey(data, map, char) {
  if (!map || !char) return undefined;

  if (shouldUseCaseSensitiveLetters(data, char)) {
    return hasOwn(map, char) ? char : undefined;
  }

  if (hasOwn(map, char)) return char;

  const upper = char.toUpperCase?.();
  const lower = char.toLowerCase?.();

  if (hasOwn(map, upper)) return upper;
  if (hasOwn(map, lower)) return lower;

  return undefined;
}

function getLetterSetting(data, char) {
  const settings = data.letter_settings || {};
  const key = resolveLetterKey(data, settings, char);

  return key === undefined ? {} : settings[key];
}

function getLetterWidth(data, char, scope, globalWidth, spaceWidth) {
  if (char === ' ') {
    return spaceWidth === '' || spaceWidth === undefined || spaceWidth === null
      ? globalWidth
      : spaceWidth;
  }

  const letterSetting = getLetterSetting(data, char);

  if (
    letterSetting.width === '' ||
    letterSetting.width === undefined ||
    letterSetting.width === null
  ) {
    return globalWidth;
  }

  return parseInput('float', letterSetting.width, globalWidth, scope);
}

function getLetterSlab(data, char) {
  const letterSlabs = data.letter_slabs || {};
  const key = resolveLetterKey(data, letterSlabs, char);

  return key === undefined ? undefined : letterSlabs[key];
}

Layout.prototype.textSlab = function (data = {}, scope) {
  const text = data.text || '';
  const lineHeightMode = data.line_height_mode || 'horizontal';

  const lineHeight = parseInput('float', data.line_height, 1, scope);
  const globalLetterWidth = parseInput('float', data.global_letter_width, 0.5, scope);

  const rawSpaceWidth = data.space_width;
  const spaceWidth =
    rawSpaceWidth === '' ||
    rawSpaceWidth === undefined ||
    rawSpaceWidth === null
      ? ''
      : parseInput('float', rawSpaceWidth, globalLetterWidth, scope);

  const lines = String(text).split(/\r?\n/);

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    let xOffset = 0;

    const lineOffset = -lineIndex * lineHeight;
    const yLineOffset = lineHeightMode === 'vertical' ? lineOffset : 0;
    const zLineOffset = lineHeightMode === 'horizontal' ? lineOffset : 0;

    for (const char of [...lines[lineIndex]]) {
      const letterLayouts = getLetterSlab(data, char);
      const letterSetting = getLetterSetting(data, char);

      const individualXOffset = parseInput(
        'float',
        letterSetting.x_offset,
        0,
        scope
      );

      const individualZOffset = parseInput(
        'float',
        letterSetting.z_offset,
        0,
        scope
      );

      const individualYOffset = parseInput(
        'float',
        letterSetting.y_offset,
        0,
        scope
      );

      if (letterLayouts) {
        const letterLayout = new Layout(plainClone(letterLayouts));

        letterLayout.offset({
          offset: {
            x: xOffset + individualXOffset,
            y: yLineOffset + individualYOffset,
            z: zLineOffset + individualZOffset,
          },
        }, scope, 0);

        letterLayout._stripSeq(letterLayout.layouts);
        this.add(letterLayout);
      }

      xOffset += getLetterWidth(data, char, scope, globalLetterWidth, spaceWidth);
    }
  }

  return this.cleanup();
};