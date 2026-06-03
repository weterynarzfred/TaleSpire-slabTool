
import Layout from '../Layout';
import parseInput from '../parseInput';

function plainClone(value) {
  return JSON.parse(JSON.stringify(value ?? []));
}

function getLetterSetting(data, char) {
  const settings = data.letter_settings || {};

  return (
    settings[char] ||
    settings[char.toUpperCase?.()] ||
    settings[char.toLowerCase?.()] ||
    {}
  );
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

  return (
    letterSlabs[char] ||
    letterSlabs[char.toUpperCase?.()] ||
    letterSlabs[char.toLowerCase?.()]
  );
}

Layout.prototype.textSlab = function (data = {}, scope) {
  const text = data.text || '';

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
    const zLineOffset = -lineIndex * lineHeight;

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

      if (letterLayouts) {
        const letterLayout = new Layout(plainClone(letterLayouts));

        letterLayout.offset({
          offset: {
            x: xOffset + individualXOffset,
            y: 0,
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