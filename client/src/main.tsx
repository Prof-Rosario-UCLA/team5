// client/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './APP';

// Root element injected by index.html
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
