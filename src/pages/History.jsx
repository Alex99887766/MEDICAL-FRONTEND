import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from '@mui/material';
import api from '../api/api';

export default function History() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Завантажуємо дані при першому рендері компонента
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/api/records/my-history');
        // Бекенд має повернути масив об'єктів MedicalCaseResponse
        setCases(response.data);
      } catch (err) {
        console.error(err);
        setError("Не вдалося завантажити історію хвороб. Перевірте з'єднання.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Історія хвороб
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Тут відображаються всі ваші медичні записи та діагнози.
      </Typography>

      {/* Обробка стану помилки */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Обробка стану завантаження */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="medical history table">
            <TableHead sx={{ bgcolor: '#f1f5f9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Дата створення</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Назва (Діагноз)</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Опис</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Призначення</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {cases.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                    sx={{ py: 3, color: 'text.secondary' }}
                  >
                    У вас поки немає медичних записів.
                  </TableCell>
                </TableRow>
              ) : (
                cases.map((medicalCase) => (
                  <TableRow
                    key={medicalCase.id}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { bgcolor: '#f8fafc' },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {/* Відформатуємо дату, щоб вона виглядала гарно */}
                      {new Date(medicalCase.created_at).toLocaleDateString('uk-UA')}
                    </TableCell>
                    <TableCell fontWeight="medium">{medicalCase.case_name}</TableCell>
                    <TableCell>{medicalCase.description || '—'}</TableCell>
                    <TableCell>{medicalCase.treatment || '—'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
