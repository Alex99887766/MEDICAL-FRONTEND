import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Імпорт сторінок
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Тимчасові компоненти-заглушки для сторінок
const Dashboard = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h2>Головний кабінет (Пацієнт / Лікар)</h2>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Відкриті маршрути, доступні всім */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Захищені маршрути (поки що відкриті для тестування) */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
