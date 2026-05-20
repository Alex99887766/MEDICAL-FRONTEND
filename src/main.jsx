import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// 1. Імпортуємо CssBaseline з Material UI
import { CssBaseline } from '@mui/material';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Додаємо його перед основним компонентом App */}
    <CssBaseline />
    <App />
  </React.StrictMode>
);
