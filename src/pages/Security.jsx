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
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';

// Тимчасові фейкові дані (Mock Data)
const securityLogs = [
  {
    id: 1,
    datetime: '2026-05-20 14:30',
    user: 'Іванов О.П.',
    role: 'Лікар',
    action: 'Перегляд історії',
    type: 'view',
  },
  {
    id: 2,
    datetime: '2026-05-19 09:15',
    user: 'Сидоренко В.М.',
    role: 'Лікар',
    action: 'Додано новий діагноз',
    type: 'edit',
  },
  {
    id: 3,
    datetime: '2026-05-18 18:45',
    user: 'Ви (Пацієнт)',
    role: 'Власник',
    action: 'Завантаження PDF-результатів',
    type: 'download',
  },
  {
    id: 4,
    datetime: '2026-05-15 10:00',
    user: 'Коваленко І.С.',
    role: 'Лікар',
    action: 'Перегляд історії',
    type: 'view',
  },
];

// Функція для відображення відповідної іконки та кольору дії
const getActionChip = (type, actionName) => {
  switch (type) {
    case 'view':
      return (
        <Chip
          icon={<VisibilityIcon />}
          label={actionName}
          size="small"
          color="info"
          variant="outlined"
        />
      );
    case 'edit':
      return (
        <Chip
          icon={<EditIcon />}
          label={actionName}
          size="small"
          color="warning"
          variant="outlined"
        />
      );
    case 'download':
      return (
        <Chip
          icon={<DownloadIcon />}
          label={actionName}
          size="small"
          color="success"
          variant="outlined"
        />
      );
    default:
      return <Chip label={actionName} size="small" variant="outlined" />;
  }
};

export default function Security() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Журнал безпеки
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Контролюйте, хто і коли отримував доступ до ваших медичних даних.
      </Typography>

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
            {securityLogs.map((log) => (
              <TableRow
                key={log.id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { bgcolor: '#f8fafc' },
                }}
              >
                <TableCell component="th" scope="row">
                  {log.datetime}
                </TableCell>
                <TableCell fontWeight="medium">{log.user}</TableCell>
                <TableCell>{log.role}</TableCell>
                <TableCell>{getActionChip(log.type, log.action)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
