import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  // Стани для зберігання даних форми
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('1'); // 1 - Пацієнт (за замовчуванням), 2 - Лікар

  // Функція обробки відправки форми
  const handleRegister = (e) => {
    e.preventDefault();

    // Поки бекенд не підключено, виводимо дані в консоль
    console.log('Дані для реєстрації:', {
      firstName,
      lastName,
      email,
      password,
      role_id: parseInt(role),
    });

    // Імітуємо успішну реєстрацію та перекидаємо в кабінет
    navigate('/dashboard');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: 4,
        bgcolor: '#f8fafc',
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              color="primary"
              gutterBottom
            >
              Реєстрація
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Створіть новий акаунт у системі MedRecords
            </Typography>
          </Box>

          <form onSubmit={handleRegister}>
            <Grid container spacing={2}>
              {/* Ім'я та Прізвище */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Ім'я"
                  fullWidth
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Прізвище"
                  fullWidth
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Grid>

              {/* Email та Пароль */}
              <Grid item xs={12}>
                <TextField
                  label="Електронна пошта"
                  type="email"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Пароль"
                  type="password"
                  fullWidth
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>

              {/* Вибір ролі */}
              <Grid item xs={12}>
                <FormControl component="fieldset" sx={{ mt: 1, width: '100%' }}>
                  <FormLabel
                    component="legend"
                    sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}
                  >
                    Оберіть вашу роль:
                  </FormLabel>
                  <RadioGroup
                    row
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    sx={{ justifyContent: 'center' }}
                  >
                    <FormControlLabel
                      value="1"
                      control={<Radio color="primary" />}
                      label="Я Пацієнт"
                    />
                    <FormControlLabel
                      value="2"
                      control={<Radio color="primary" />}
                      label="Я Лікар"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 4, mb: 2, borderRadius: 2 }}
            >
              Зареєструватися
            </Button>
          </form>

          {/* Посилання на вхід */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Вже маєте акаунт?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/login')}
                sx={{ fontWeight: 'bold', textDecoration: 'none' }}
              >
                Увійти
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
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
