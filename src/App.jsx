import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
// Імпорт сторінок
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import History from './pages/History';
import Security from './pages/Security';
import Profile from './pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Публічні маршрути */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Захищені маршрути Кабінету */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/dashboard/history" element={<History />} />
            <Route path="/dashboard/security" element={<Security />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
