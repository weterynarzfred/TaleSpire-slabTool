import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';

import './scss/index.scss';
import { prepareIndex } from "./lib/assetData";

const container = document.getElementById('root');

window.onPickingEvent = detail =>
  document.dispatchEvent(new CustomEvent('onPickingEvent', { detail }));

window.onStateChangeEvent = detail =>
  document.dispatchEvent(new CustomEvent('onStateChangeEvent', { detail }));


console.log('waiting for initialization');

await new Promise(resolve => {
  document.addEventListener('onStateChangeEvent', async event => {
    if (event.detail.kind !== 'hasInitialized') return;
    await prepareIndex();

    console.log('initialized');
    resolve();
  });
});

console.log('rendering');
const root = createRoot(container);
root.render(<App />);
