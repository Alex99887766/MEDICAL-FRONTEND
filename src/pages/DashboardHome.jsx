import { Typography, Paper, Box } from '@mui/material';

export default function DashboardHome() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Вітаємо в MedRecords
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 2, mt: 3 }}>
        <Typography variant="body1">
          Це ваша головна панель. Виберіть потрібний розділ у меню зліва.
        </Typography>
      </Paper>
    </Box>
  );
}
