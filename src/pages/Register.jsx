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
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/api'; // Імпортуємо наш клієнт

export default function Register() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('1');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        role_id: parseInt(role),
      };

      // Відправляємо дані на бекенд у форматі JSON
      await api.post('/api/auth/register', payload);

      // Після успішної реєстрації перекидаємо на сторінку входу
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          'Помилка реєстрації. Перевірте дані або спробуйте інший email.'
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

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleRegister}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Ім'я"
                  fullWidth
                  required
                  value={firstName}
                  disabled={loading}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Прізвище"
                  fullWidth
                  required
                  value={lastName}
                  disabled={loading}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Електронна пошта"
                  type="email"
                  fullWidth
                  required
                  value={email}
                  disabled={loading}
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
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>

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
                      control={<Radio color="primary" disabled={loading} />}
                      label="Я Пацієнт"
                    />
                    <FormControlLabel
                      value="2"
                      control={<Radio color="primary" disabled={loading} />}
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
              disabled={loading}
              sx={{ mt: 4, mb: 2, borderRadius: 2, height: 48 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Зареєструватися'
              )}
            </Button>
          </form>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Вже маєте акаунт?{' '}
              <Link
                component="button"
                variant="body2"
                disabled={loading}
                onClick={() => navigate('/login')}
                sx={{ fontWeight: 'bold', textDecoration: 'none' }}
              >
                Увійти
              </Link>
            </Typography>

            <Button
              variant="text"
              size="small"
              disabled={loading}
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
