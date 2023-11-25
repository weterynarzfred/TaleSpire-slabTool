import { jsonrepair } from 'jsonrepair';

import generate from './generate';
import readSlab from './readSlab';
import { decodeSlab, encodeSlab } from './encoding';
import writeSlab from './writeSlab';

const pasteInputElement = document.getElementById('paste-input');
const dataInputElement = document.getElementById('data-input');
const dataShownCheckboxElement = document.getElementById('data-shown-checkbox');
const copyButtonElement = document.getElementById('copy-button');

copyButtonElement.addEventListener('click', () => {
  navigator.clipboard.writeText(pasteInputElement.value).then(() => {
    copyButtonElement.innerText = 'copied';
    setTimeout(() => {
      copyButtonElement.innerText = 'copy';
    }, 500);
  });
});

let isDataShown = false;

function parseBase64(base64) {
  try {
    const decodedSlab = decodeSlab(pasteInputElement.value);
    const layoutsObject = readSlab(decodedSlab, isDataShown);
    return JSON.stringify(layoutsObject, null, 2);
  } catch { }

  return false;
}

function parseJson(json) {
  try {
    const cleanedJson = jsonrepair(json);
    const layoutsObject = JSON.parse(cleanedJson);
    return encodeSlab(writeSlab(layoutsObject));
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
  if (!dataInputElement.value) {
    pasteInputElement.value = '';
  }

  const base64 = parseJson(dataInputElement.value);
  if (base64) pasteInputElement.value = base64;
  else pasteInputElement.value = "something is BrOkEn";
});

dataShownCheckboxElement.addEventListener('change', () => {
  isDataShown = dataShownCheckboxElement.checked;

  const data = parseBase64(pasteInputElement.value);
  if (data) dataInputElement.value = data;
});

const generatedData = generate();
console.log(generatedData);
const base64 = encodeSlab(writeSlab(generatedData));
pasteInputElement.value = base64;
const data = parseBase64(pasteInputElement.value);
if (data) dataInputElement.value = data;
