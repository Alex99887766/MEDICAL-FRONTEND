import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Button,
  TextField,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import api from '../api/api';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Стани для редагування
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [editData, setEditData] = useState({ first_name: '', last_name: '', phone: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/auth/me');
        setUser(response.data);
        // Заповнюємо форму редагування поточними даними
        setEditData({
          first_name: response.data.first_name || '',
          last_name: response.data.last_name || '',
          phone: response.data.phone || '',
        });
      } catch (err) {
        console.error(err);
        setError('Не вдалося завантажити дані профілю.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    setError(''); // Очищаємо попередні помилки

    // --- БЛОК ВАЛІДАЦІЇ ---
    if (!editData.first_name.trim() || editData.first_name.length > 25) {
      setError("Ім'я не може бути порожнім і має містити до 25 символів.");
      return; // Зупиняємо виконання, якщо є помилка
    }

    if (!editData.last_name.trim() || editData.last_name.length > 30) {
      setError('Прізвище не може бути порожнім і має містити до 30 символів.');
      return;
    }

    // Регулярний вираз для телефону: від 10 до 15 цифр, опціональний + на початку
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (editData.phone && !phoneRegex.test(editData.phone.replace(/\s+/g, ''))) {
      setError('Введіть коректний номер телефону (наприклад: +380991234567).');
      return;
    }
    // --- КІНЕЦЬ ВАЛІДАЦІЇ ---

    setUpdateLoading(true);
    try {
      const response = await api.put('/api/auth/me', {
        ...editData,
        phone: editData.phone.replace(/\s+/g, ''), // Видаляємо пробіли перед відправкою
      });
      setUser(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError('Не вдалося оновити профіль. Перевірте введені дані.');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Мій профіль
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Ваші особисті дані та налаштування акаунта.
          </Typography>
        </Box>

        {/* Кнопка перемикання режиму редагування */}
        {!isEditing ? (
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setIsEditing(true)}
          >
            Редагувати
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="text"
              color="error"
              disabled={updateLoading}
              onClick={() => setIsEditing(false)}
            >
              Скасувати
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<SaveIcon />}
              disabled={updateLoading}
              onClick={handleSave}
            >
              {updateLoading ? 'Збереження...' : 'Зберегти'}
            </Button>
          </Box>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', mr: 3 }}>
            <PersonIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {isEditing
                ? 'Редагування профілю'
                : `${user?.first_name} ${user?.last_name}`}
            </Typography>
            <Chip
              label={user?.role_id === 1 ? 'Пацієнт' : 'Лікар'}
              color={user?.role_id === 1 ? 'info' : 'success'}
              size="small"
              sx={{ mt: 1, fontWeight: 'bold' }}
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              Унікальний медичний ID (Передайте лікарю)
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              #{user?.id || user?.patient_id || '—'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Ім'я
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                inputProps={{ maxLength: 25 }}
                value={editData.first_name}
                onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
              />
            ) : (
              <Typography variant="body1" fontWeight="medium">
                {user?.first_name}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Прізвище
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                inputProps={{ maxLength: 30 }}
                value={editData.last_name}
                onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
              />
            ) : (
              <Typography variant="body1" fontWeight="medium">
                {user?.last_name}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Електронна пошта
            </Typography>
            <Typography variant="body1" fontWeight="medium" color="text.secondary">
              {user?.email}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Номер телефону
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                placeholder="+380..."
                inputProps={{ maxLength: 15 }}
                value={editData.phone}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
              />
            ) : (
              <Typography variant="body1" fontWeight="medium">
                {user?.phone || 'Не вказано'}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
