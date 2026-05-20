import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Імпортуємо нашу готову головну сторінку
import Landing from './pages/Landing'; 

// Тимчасові компоненти-заглушки для сторінок, які ми створимо пізніше
const Login = () => <div style={{ padding: '2rem', textAlign: 'center' }}><h2>Сторінка авторизації</h2></div>;
const Register = () => <div style={{ padding: '2rem', textAlign: 'center' }}><h2>Сторінка реєстрації</h2></div>;
const Dashboard = () => <div style={{ padding: '2rem', textAlign: 'center' }}><h2>Головний кабінет (Пацієнт / Лікар)</h2></div>;

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