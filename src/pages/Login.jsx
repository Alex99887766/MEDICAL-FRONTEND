import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  // Стани для зберігання введених даних
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Функція обробки форми
  const handleLogin = (e) => {
    e.preventDefault();

    // Поки бекенд не підключено, просто виводимо дані в консоль
    console.log('Спроба входу:', { email, password });

    // Імітуємо успішний вхід і перекидаємо в кабінет
    navigate('/dashboard');
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
          {/* Заголовок */}
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

          {/* Форма */}
          <form onSubmit={handleLogin}>
            <TextField
              label="Електронна пошта"
              type="email"
              fullWidth
              required
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Пароль"
              type="password"
              fullWidth
              required
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 3, mb: 2, borderRadius: 2 }}
            >
              Увійти
            </Button>
          </form>

          {/* Посилання на реєстрацію */}
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
            sx={{ mt: 3, color: 'text.secondary' }}
          >
            ← Повернутися на головну
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
