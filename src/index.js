import React from 'react';
import { createRoot } from 'react-dom/client';
import { toast, Flip } from 'react-toastify';

import Navigation from './routes';

toast.configure({
  autoClose: false,
  transition: Flip,
  closeOnClick: false,
});

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Navigation />
  </React.StrictMode>
);
