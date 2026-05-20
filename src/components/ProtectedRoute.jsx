import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  // Перевіряємо, чи є токен доступу в локальному сховищі
  const token = localStorage.getItem('token');

  // Якщо токена немає - примусово перекидаємо на сторінку входу
  // replace: true потрібен, щоб користувач не міг повернутися назад кнопкою "Back" у браузері
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Якщо токен є - пропускаємо далі (рендеримо сторінки кабінету)
  return <Outlet />;
}
