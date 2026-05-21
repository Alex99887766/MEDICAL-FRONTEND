import { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, TextField, Button, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Chip, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import api from '../api/api';

export default function DashboardHome() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Спільні стани
  const [patientHistory, setPatientHistory] = useState([]);
  
  // Стани для лікаря (Пошук та Оновлення)
  const [searchId, setSearchId] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchedPatientId, setSearchedPatientId] = useState(null);
  
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editRecord, setEditRecord] = useState({ id: null, case_name: '', description: '', treatment: '' });

  // Стани для пацієнта (Створення)
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newRecord, setNewRecord] = useState({ case_name: '', description: '' });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/api/auth/me');
        setUser(response.data);
        // Якщо це пацієнт, одразу вантажимо його історію для таблиці на головній
        if (response.data.role_id === 1) {
          const historyRes = await api.get('/api/records/my-history');
          setPatientHistory(historyRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // ================= ЛОГІКА ПАЦІЄНТА =================
  const handleCreateRecord = async () => {
    setCreateLoading(true);
    try {
      // Пацієнт створює запис. patient_id бекенд бере сам із токена.
      await api.post('/api/records/cases', {
        case_name: newRecord.case_name,
        description: newRecord.description.trim() === '' ? null : newRecord.description,
      });
      
      setOpenCreateModal(false);
      setNewRecord({ case_name: '', description: '' });
      
      // Оновлюємо таблицю
      const historyRes = await api.get('/api/records/my-history');
      setPatientHistory(historyRes.data);
    } catch (err) {
      const errorMsg = err.response?.data?.detail;
      alert(`Помилка: ${typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg)}`);
    } finally {
      setCreateLoading(false);
    }
  };

  // ================= ЛОГІКА ЛІКАРЯ =================
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId) return;
    setSearchLoading(true);
    setSearchError('');
    setPatientHistory([]);
    try {
      const response = await api.get(`/api/records/doctor/patient/${searchId}/history`);
      setPatientHistory(response.data);
      setSearchedPatientId(searchId);
    } catch (err) {
      setSearchError(err.response?.data?.detail || 'Пацієнта не знайдено.');
      setSearchedPatientId(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleUpdateRecord = async () => {
    setCreateLoading(true);
    try {
      // Лікар оновлює існуючий запис
      await api.put(`/api/records/cases/${editRecord.id}`, {
        case_name: editRecord.case_name,
        description: editRecord.description || null,
        treatment: editRecord.treatment || null
      });
      
      setOpenEditModal(false);
      
      // Оновлюємо таблицю пошуку
      const response = await api.get(`/api/records/doctor/patient/${searchedPatientId}/history`);
      setPatientHistory(response.data);
    } catch (err) {
      alert('Помилка при оновленні запису.');
    } finally {
      setCreateLoading(false);
    }
  };

  const openEdit = (record) => {
    setEditRecord({
      id: record.id,
      case_name: record.case_name,
      description: record.description || '',
      treatment: record.treatment || ''
    });
    setOpenEditModal(true);
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color={user?.role_id === 1 ? 'primary' : 'success.main'}>
          {user?.role_id === 1 ? `Вітаємо, ${user.first_name}!` : 'Панель лікаря'}
        </Typography>
        <Chip 
          label={user?.role_id === 1 ? 'Пацієнт' : `Доктор ${user?.last_name}`} 
          color={user?.role_id === 1 ? 'primary' : 'success'} 
          variant="outlined" 
        />
      </Box>

      {/* ================= ІНТЕРФЕЙС ПАЦІЄНТА ================= */}
      {user?.role_id === 1 && (
        <Box>
          <Paper sx={{ p: 3, borderRadius: 2, mb: 4, borderLeft: '5px solid #1976d2' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1">
                Відкрийте новий медичний запис, щоб ваш лікар міг призначити лікування.
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreateModal(true)}>
                Відкрити справу
              </Button>
            </Box>
          </Paper>

          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Ваші активні записи</Typography>
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Дата</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Скарги (Діагноз)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Призначення лікаря</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patientHistory.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{new Date(record.created_at).toLocaleDateString('uk-UA')}</TableCell>
                    <TableCell fontWeight="bold">{record.case_name}</TableCell>
                    <TableCell>
                      {record.treatment ? (
                        <Chip label="Призначено" color="success" size="small" sx={{ mr: 1 }} />
                      ) : (
                        <Chip label="Очікує лікаря" color="warning" size="small" sx={{ mr: 1 }} />
                      )}
                      {record.treatment}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Модалка Створення (Пацієнт) */}
          <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)} maxWidth="sm" fullWidth>
            <DialogTitle fontWeight="bold">Описати проблему</DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                <TextField 
                  label="Коротко про проблему (напр. Застуда)" fullWidth required variant="outlined"
                  value={newRecord.case_name} onChange={(e) => setNewRecord({...newRecord, case_name: e.target.value})}
                />
                <TextField 
                  label="Детальний опис симптомів" fullWidth multiline rows={3} variant="outlined"
                  value={newRecord.description} onChange={(e) => setNewRecord({...newRecord, description: e.target.value})}
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setOpenCreateModal(false)} color="inherit">Скасувати</Button>
              <Button onClick={handleCreateRecord} variant="contained" disabled={!newRecord.case_name || createLoading}>
                {createLoading ? 'Відправка...' : 'Відкрити запис'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}

      {/* ================= ІНТЕРФЕЙС ЛІКАРЯ ================= */}
      {user?.role_id === 2 && (
        <Box>
          <Paper sx={{ p: 3, borderRadius: 2, mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">Пошук пацієнта</Typography>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '16px' }}>
              <TextField
                label="ID Пацієнта" variant="outlined" size="small" type="number"
                value={searchId} onChange={(e) => setSearchId(e.target.value)} sx={{ width: '250px' }}
              />
              <Button 
                type="submit" variant="contained" color="success" disabled={searchLoading || !searchId}
                startIcon={searchLoading ? <CircularProgress size={20} /> : <SearchIcon />}
              >
                Знайти картку
              </Button>
            </form>
            {searchError && <Alert severity="error" sx={{ mt: 2 }}>{searchError}</Alert>}
          </Paper>

          {searchedPatientId && (
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Медична історія (Пацієнт ID: {searchedPatientId})
              </Typography>
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Дата</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Скарги</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Призначення</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Дія</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {patientHistory.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{new Date(record.created_at).toLocaleDateString('uk-UA')}</TableCell>
                        <TableCell fontWeight="bold">{record.case_name}</TableCell>
                        <TableCell>{record.treatment || <Typography color="error" variant="body2">Немає</Typography>}</TableCell>
                        <TableCell align="right">
                          <Button size="small" variant="outlined" color="success" startIcon={<EditIcon />} onClick={() => openEdit(record)}>
                            Призначити
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Модалка Оновлення (Лікар) */}
          <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="sm" fullWidth>
            <DialogTitle fontWeight="bold">Призначення лікування</DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                <TextField 
                  label="Уточнений діагноз" fullWidth variant="outlined"
                  value={editRecord.case_name} onChange={(e) => setEditRecord({...editRecord, case_name: e.target.value})}
                />
                <TextField 
                  label="Симптоми пацієнта (можна змінити)" fullWidth multiline rows={2} variant="outlined"
                  value={editRecord.description} onChange={(e) => setEditRecord({...editRecord, description: e.target.value})}
                />
                <TextField 
                  label="Лікування (Рецепт)" fullWidth multiline rows={3} required variant="outlined" color="success" focused
                  value={editRecord.treatment} onChange={(e) => setEditRecord({...editRecord, treatment: e.target.value})}
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setOpenEditModal(false)} color="inherit">Скасувати</Button>
              <Button onClick={handleUpdateRecord} variant="contained" color="success" disabled={createLoading}>
                {createLoading ? 'Збереження...' : 'Зберегти призначення'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </Box>
  );
}