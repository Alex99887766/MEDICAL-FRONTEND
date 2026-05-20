import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/api'; // Імпортуємо наш API клієнт

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Для FastAPI OAuth2 потрібен формат URLSearchParams, а не звичайний об'єкт JSON
      const formData = new URLSearchParams();
      formData.append('username', email); // FastAPI обов'язково чекає поле username
      formData.append('password', password);

      // Робимо запит на правильний шлях з префіксом /api/
      const response = await api.post('/api/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      // Зберігаємо токен
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
      }

      // Перенаправляємо в кабінет
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || 'Невірний логін або пароль. Спробуйте ще раз.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        bgcolor: '#f8fafc',
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            color="primary"
            gutterBottom
          >
            Вхід
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Увійдіть до системи MedRecords
          </Typography>

          {/* Вивід помилки, якщо вона є */}
          {error && (
            <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              label="Електронна пошта"
              type="email"
              fullWidth
              required
              margin="normal"
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Пароль"
              type="password"
              fullWidth
              required
              margin="normal"
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2, borderRadius: 2, height: 48 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Увійти'}
            </Button>
          </form>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Ще немає акаунта?{' '}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/register')}
              sx={{ fontWeight: 'bold', textDecoration: 'none' }}
            >
              Зареєструватися
            </Link>
          </Typography>

          <Button
            variant="text"
            size="small"
            onClick={() => navigate('/')}
            disabled={loading}
            sx={{ mt: 3, color: 'text.secondary' }}
          >
            ← Повернутися на головну
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
