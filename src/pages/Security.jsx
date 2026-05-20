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
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import api from '../api/api';

// Функція для підбору іконки залежно від типу дії
const getActionChip = (action) => {
  const actionLower = action?.toLowerCase() || '';

  if (
    actionLower.includes('перегляд') ||
    actionLower.includes('view') ||
    actionLower.includes('read')
  ) {
    return (
      <Chip
        icon={<VisibilityIcon />}
        label={action}
        size="small"
        color="info"
        variant="outlined"
      />
    );
  }
  if (
    actionLower.includes('додано') ||
    actionLower.includes('оновлено') ||
    actionLower.includes('edit') ||
    actionLower.includes('update')
  ) {
    return (
      <Chip
        icon={<EditIcon />}
        label={action}
        size="small"
        color="warning"
        variant="outlined"
      />
    );
  }
  if (actionLower.includes('завантаження') || actionLower.includes('download')) {
    return (
      <Chip
        icon={<DownloadIcon />}
        label={action}
        size="small"
        color="success"
        variant="outlined"
      />
    );
  }

  return <Chip label={action} size="small" variant="outlined" />;
};

export default function Security() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/api/records/my-card-logs');
        setLogs(response.data);
      } catch (err) {
        console.error(err);
        setError('Не вдалося завантажити журнал безпеки. Спробуйте пізніше.');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Журнал безпеки
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Контролюйте, хто і коли отримував доступ до ваших медичних даних.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="security log table">
            <TableHead sx={{ bgcolor: '#f1f5f9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Дата та Час</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Користувач</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Роль</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Дія</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                    sx={{ py: 3, color: 'text.secondary' }}
                  >
                    Записів про доступ до вашої картки поки немає.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow
                    key={log.id}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { bgcolor: '#f8fafc' },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {/* Обробка дати з бекенду */}
                      {log.timestamp || log.created_at
                        ? new Date(log.timestamp || log.created_at).toLocaleString(
                            'uk-UA'
                          )
                        : '—'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'medium' }}>
                      {log.user_name || log.doctor_name || log.user || '—'}
                    </TableCell>
                    <TableCell>{log.role || 'Лікар'}</TableCell>
                    <TableCell>
                      {getActionChip(log.action || log.action_name || 'Перегляд')}
                    </TableCell>
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
