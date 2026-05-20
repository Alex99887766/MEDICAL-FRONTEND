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

// Тимчасові фейкові дані (Mock Data)
const mockRecords = [
  {
    id: 1,
    date: '2026-05-15',
    diagnosis: 'Гострий бронхіт',
    doctor: 'Іванов О.П.',
    status: 'Вилікувано',
  },
  {
    id: 2,
    date: '2026-05-18',
    diagnosis: 'Мігрень',
    doctor: 'Сидоренко В.М.',
    status: 'В процесі',
  },
  {
    id: 3,
    date: '2026-05-20',
    diagnosis: 'Плановий огляд',
    doctor: 'Коваленко І.С.',
    status: 'Завершено',
  },
];

// Функція для підбору кольору статусу
const getStatusColor = (status) => {
  switch (status) {
    case 'Вилікувано':
    case 'Завершено':
      return 'success';
    case 'В процесі':
      return 'warning';
    default:
      return 'default';
  }
};

export default function History() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Історія хвороб
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Тут відображаються всі ваші медичні записи та діагнози.
      </Typography>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="medical history table">
          {/* Заголовок таблиці */}
          <TableHead sx={{ bgcolor: '#f1f5f9' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Дата</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Діагноз</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Лікуючий лікар</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Статус</TableCell>
            </TableRow>
          </TableHead>

          {/* Тіло таблиці */}
          <TableBody>
            {mockRecords.map((record) => (
              <TableRow
                key={record.id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { bgcolor: '#f8fafc' },
                }}
              >
                <TableCell component="th" scope="row">
                  {record.date}
                </TableCell>
                <TableCell>{record.diagnosis}</TableCell>
                <TableCell>{record.doctor}</TableCell>
                <TableCell>
                  <Chip
                    label={record.status}
                    color={getStatusColor(record.status)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
