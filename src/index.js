import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';

import './scss/index.scss';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

window.onPickingEvent = detail =>
  document.dispatchEvent(new CustomEvent('onPickingEvent', { detail }));
