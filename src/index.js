import React from 'react';
import { createRoot } from 'react-dom/client';

import Navigation from 'routes';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Navigation />
  </React.StrictMode>
);
