import { jsonrepair } from 'jsonrepair';

import generate from './generate';
import readSlab from './readSlab';
import { decodeSlab, encodeSlab } from './encoding';
import writeSlab from './writeSlab';
import bytes from 'bytes';

const pasteInputElement = document.getElementById('paste-input');
const dataInputElement = document.getElementById('data-input');
const dataShownCheckboxElement = document.getElementById('data-shown-checkbox');
const copyButtonElement = document.getElementById('copy-button');
const byteCountElement = document.getElementById('byte-count');

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

  return { base64: false, dataLength: 0 };
}

function displayByteLength(dataLength) {
  if (!dataLength) {
    byteCountElement.innerText = "???";
    return;
  }
  byteCountElement.innerText = bytes(dataLength);
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

  const { base64, dataLength } = parseJson(dataInputElement.value);
  if (base64) pasteInputElement.value = base64;
  else pasteInputElement.value = "something is BrOkEn";
  displayByteLength(dataLength);
});

dataShownCheckboxElement.addEventListener('change', () => {
  isDataShown = dataShownCheckboxElement.checked;

  const data = parseBase64(pasteInputElement.value);
  if (data) dataInputElement.value = data;
});

const generatedData = generate();
console.log(generatedData);
const { base64, dataLength } = encodeSlab(writeSlab(generatedData));
pasteInputElement.value = base64;
displayByteLength(dataLength);
const data = parseBase64(pasteInputElement.value);
if (data) dataInputElement.value = data;
