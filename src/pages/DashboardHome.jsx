import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import api from '../api/api';

export default function DashboardHome() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Спільні стани
  const [patientHistory, setPatientHistory] = useState([]);

  // Стани для лікаря
  const [searchId, setSearchId] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchedPatientId, setSearchedPatientId] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editRecord, setEditRecord] = useState({
    id: null,
    case_name: '',
    description: '',
    treatment: '',
  });

  // Стани для пацієнта
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newRecord, setNewRecord] = useState({ case_name: '', description: '' });

  // Стани для завантаження файлів
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadData, setUploadData] = useState({ caseId: null, title: '', file: null });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/api/auth/me');
        setUser(response.data);
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
      await api.post('/api/records/cases', {
        case_name: newRecord.case_name,
        description: newRecord.description.trim() === '' ? null : newRecord.description,
      });
      setOpenCreateModal(false);
      setNewRecord({ case_name: '', description: '' });
      const historyRes = await api.get('/api/records/my-history');
      setPatientHistory(historyRes.data);
    } catch (err) {
      alert(`Помилка: ${err.response?.data?.detail || 'Не вдалося створити запис'}`);
    } finally {
      setCreateLoading(false);
    }
  };

  const openUpload = (caseId) => {
    setUploadData({ caseId, title: '', file: null });
    setOpenUploadModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Дозволені формати (PDF, JPG, PNG)
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];

    if (!allowedTypes.includes(file.type)) {
      alert('Дозволено завантажувати лише медичні документи (PDF, JPG або PNG)!');
      return;
    }

    // Обмеження розміру (5мб)
    if (file.size > 5 * 1024 * 1024) {
      alert('Файл занадто великий! Максимальний розмір - 5 МБ.');
      return;
    }

    setUploadData({ ...uploadData, file });
  };

  const handleUploadFile = async () => {
    if (!uploadData.title || !uploadData.file) return;
    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', uploadData.title);
      formData.append('file', uploadData.file);

      await api.post(`/api/records/cases/${uploadData.caseId}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setOpenUploadModal(false);
      // Оновлюємо історію, щоб новий файл з'явився в таблиці
      const historyRes = await api.get('/api/records/my-history');
      setPatientHistory(historyRes.data);
    } catch (err) {
      alert(
        `Помилка при завантаженні: ${err.response?.data?.detail || 'Перевірте формат файлу'}`
      );
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цей документ?')) return;

    try {
      await api.delete(`/api/records/records/${fileId}`);
      if (user?.role_id === 1) {
        const historyRes = await api.get('/api/records/my-history');
        setPatientHistory(historyRes.data);
      } else {
        const response = await api.get(
          `/api/records/doctor/patient/${searchedPatientId}/history`
        );
        setPatientHistory(response.data);
      }
    } catch (err) {
      console.error('Деталі помилки видалення:', err.response?.data);

      const errorMsg = err.response?.data?.detail || err.message || 'Невідома помилка';

      // Якщо це об'єкт, спробуємо отримати з нього хоч щось зрозуміле
      const textToDisplay =
        typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg;

      alert(`Помилка при видаленні:\n${textToDisplay}`);
    }
  };

  const handleDeleteCase = async (caseId) => {
    if (
      !window.confirm(
        'Видалити медичну справу та всі прикріплені до неї файли? Цю дію неможливо скасувати.'
      )
    )
      return;

    try {
      await api.delete(`/api/records/cases/${caseId}`);

      // Оновлюємо дані таблиці залежно від ролі
      if (user?.role_id === 1) {
        const historyRes = await api.get('/api/records/my-history');
        setPatientHistory(historyRes.data);
      } else {
        const response = await api.get(
          `/api/records/doctor/patient/${searchedPatientId}/history`
        );
        setPatientHistory(response.data);
      }
    } catch (err) {
      console.error('Деталі помилки видалення кейсу:', err.response?.data);
      alert(
        `Помилка видалення: ${err.response?.data?.detail || 'Ендпоінт недоступний або немає прав'}`
      );
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
      await api.put(`/api/records/cases/${editRecord.id}`, {
        case_name: editRecord.case_name,
        description:
          editRecord.description?.trim() === '' ? null : editRecord.description,
        treatment: editRecord.treatment?.trim() === '' ? null : editRecord.treatment,
      });
      setOpenEditModal(false);
      const response = await api.get(
        `/api/records/doctor/patient/${searchedPatientId}/history`
      );
      setPatientHistory(response.data);
    } catch (err) {
      console.error(err);
      alert('Помилка при оновленні запису.');
    } finally {
      setCreateLoading(false);
    }
  };

  const openEdit = (caseItem) => {
    setEditRecord({
      id: caseItem.id,
      case_name: caseItem.case_name,
      description: caseItem.description || '',
      treatment: caseItem.treatment || '',
    });
    setOpenEditModal(true);
  };

  // ================= РЕНДЕР =================
  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );

  // Компонент для рендеру файлів у таблиці
  const RenderFiles = ({ records }) => {
    if (!records || records.length === 0)
      return (
        <Typography variant="body2" color="text.secondary">
          —
        </Typography>
      );
    return (
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {records.map((file) => (
          <Chip
            key={file.id}
            label={file.title}
            component="a"
            href={file.file_path}
            target="_blank"
            clickable
            color="info"
            size="small"
            icon={<AttachFileIcon />}
            onDelete={(e) => {
              e.preventDefault();
              handleDeleteFile(file.id);
            }}
          />
        ))}
      </Box>
    );
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          color={user?.role_id === 1 ? 'primary' : 'success.main'}
        >
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
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body1">
                Відкрийте новий медичний запис, щоб ваш лікар міг призначити лікування.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenCreateModal(true)}
              >
                Відкрити справу
              </Button>
            </Box>
          </Paper>

          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Дата</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Скарги</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Призначення</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Документи</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    Дія
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patientHistory.map((caseItem) => (
                  <TableRow key={caseItem.id}>
                    <TableCell>
                      {new Date(caseItem.created_at).toLocaleDateString('uk-UA')}
                    </TableCell>
                    <TableCell fontWeight="bold">{caseItem.case_name}</TableCell>
                    <TableCell>{caseItem.treatment || 'Очікує лікаря'}</TableCell>
                    <TableCell>
                      <RenderFiles records={caseItem.records} />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <IconButton
                          color="primary"
                          onClick={() => openUpload(caseItem.id)}
                          title="Завантажити аналізи"
                        >
                          <CloudUploadIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteCase(caseItem.id)}
                          title="Видалити справу"
                        >
                          <DeleteOutlinedIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Модалка Створення (Пацієнт) */}
          <Dialog
            open={openCreateModal}
            onClose={() => setOpenCreateModal(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle fontWeight="bold">Описати проблему</DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                <TextField
                  label="Коротко про проблему"
                  fullWidth
                  required
                  variant="outlined"
                  value={newRecord.case_name}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, case_name: e.target.value })
                  }
                />
                <TextField
                  label="Детальний опис симптомів"
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  value={newRecord.description}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, description: e.target.value })
                  }
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setOpenCreateModal(false)} color="inherit">
                Скасувати
              </Button>
              <Button
                onClick={handleCreateRecord}
                variant="contained"
                disabled={!newRecord.case_name || createLoading}
              >
                {createLoading ? 'Відправка...' : 'Відкрити запис'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Модалка Завантаження файлу (Пацієнт) */}
          <Dialog
            open={openUploadModal}
            onClose={() => setOpenUploadModal(false)}
            maxWidth="xs"
            fullWidth
          >
            <DialogTitle fontWeight="bold">Додати медичний документ</DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                <TextField
                  label="Назва документа (напр. Рентген)"
                  fullWidth
                  required
                  variant="outlined"
                  value={uploadData.title}
                  onChange={(e) =>
                    setUploadData({ ...uploadData, title: e.target.value })
                  }
                />
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={<AttachFileIcon />}
                  sx={{
                    height: '56px',
                    textTransform: 'none',
                    justifyContent: 'flex-start',
                    px: 2,
                  }}
                >
                  <Typography noWrap sx={{ width: '100%', textAlign: 'left' }}>
                    {uploadData.file ? uploadData.file.name : 'Оберіть файл...'}
                  </Typography>
                  <input
                    type="file"
                    hidden
                    accept=".pdf, image/jpeg, image/png"
                    onChange={handleFileChange}
                  />
                </Button>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setOpenUploadModal(false)} color="inherit">
                Скасувати
              </Button>
              <Button
                onClick={handleUploadFile}
                variant="contained"
                disabled={!uploadData.title || !uploadData.file || uploadLoading}
              >
                {uploadLoading ? 'Завантаження...' : 'Відправити'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}

      {/* ================= ІНТЕРФЕЙС ЛІКАРЯ ================= */}
      {user?.role_id === 2 && (
        <Box>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              mb: 4,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Пошук пацієнта
            </Typography>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '16px' }}>
              <TextField
                label="ID Пацієнта"
                variant="outlined"
                size="small"
                type="number"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                sx={{ width: '250px' }}
              />
              <Button
                type="submit"
                variant="contained"
                color="success"
                disabled={searchLoading || !searchId}
                startIcon={
                  searchLoading ? <CircularProgress size={20} /> : <SearchIcon />
                }
              >
                Знайти картку
              </Button>
            </form>
            {searchError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {searchError}
              </Alert>
            )}
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
                      <TableCell sx={{ fontWeight: 'bold' }}>
                        Документи пацієнта
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        Дія
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {patientHistory.map((caseItem) => (
                      <TableRow key={caseItem.id}>
                        <TableCell>
                          {new Date(caseItem.created_at).toLocaleDateString('uk-UA')}
                        </TableCell>
                        <TableCell fontWeight="bold">{caseItem.case_name}</TableCell>
                        <TableCell>
                          {caseItem.treatment || (
                            <Typography color="error" variant="body2">
                              Немає
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <RenderFiles records={caseItem.records} />
                        </TableCell>
                        <TableCell align="right">
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <Button
                              size="small"
                              variant="contained"
                              color={caseItem.treatment ? 'info' : 'success'}
                              startIcon={<EditIcon />}
                              onClick={() => openEdit(caseItem)}
                            >
                              {caseItem.treatment ? 'Змінити' : 'Призначити'}
                            </Button>
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteCase(caseItem.id)}
                              title="Видалити справу"
                            >
                              <DeleteOutlinedIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Модалка Оновлення (Лікар) */}
          <Dialog
            open={openEditModal}
            onClose={() => setOpenEditModal(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle fontWeight="bold">Призначення лікування</DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                <TextField
                  label="Уточнений діагноз"
                  fullWidth
                  variant="outlined"
                  value={editRecord.case_name}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, case_name: e.target.value })
                  }
                />
                <TextField
                  label="Симптоми пацієнта (можна змінити)"
                  fullWidth
                  multiline
                  rows={2}
                  variant="outlined"
                  value={editRecord.description}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, description: e.target.value })
                  }
                />
                <TextField
                  label="Лікування (Рецепт)"
                  fullWidth
                  multiline
                  rows={3}
                  required
                  variant="outlined"
                  color="success"
                  focused
                  value={editRecord.treatment}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, treatment: e.target.value })
                  }
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setOpenEditModal(false)} color="inherit">
                Скасувати
              </Button>
              <Button
                onClick={handleUpdateRecord}
                variant="contained"
                color="success"
                disabled={createLoading}
              >
                {createLoading ? 'Збереження...' : 'Зберегти призначення'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </Box>
  );
}
