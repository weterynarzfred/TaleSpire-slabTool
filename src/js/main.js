import { decodeSlab, encodeSlab, readSlab, writeSlab } from './talespire';

const pasteInputElement = document.getElementById('paste-input');
const dataInputElement = document.getElementById('data-input');
const dataShownCheckboxElement = document.getElementById('data-shown-checkbox');

let isDataShown = true;

function parseBase64(base64) {
  try {
    return JSON.stringify(
      readSlab(decodeSlab(pasteInputElement.value), isDataShown),
      null,
      2
    );
  } catch { }

  return false;
}

pasteInputElement.addEventListener('input', () => {
  if (!pasteInputElement.value) {
    dataInputElement.value = '';
    return;
  }

  const data = parseBase64(pasteInputElement.value);
  if (data) dataInputElement.value = data;
  else dataInputElement.value = "something is BrOkEn";
});

dataInputElement.addEventListener('input', () => {
  let base64;

  if (!dataInputElement.value) {
    base64 = '';
  } else {
    try {
      base64 = encodeSlab(writeSlab(JSON.parse(dataInputElement.value)));
    } catch {
      base64 = "something is BrOkEn";
    }
  }
  pasteInputElement.value = base64;
});

dataShownCheckboxElement.addEventListener('change', () => {
  isDataShown = dataShownCheckboxElement.checked;

  const data = parseBase64(pasteInputElement.value);
  if (data) dataInputElement.value = data;
});
