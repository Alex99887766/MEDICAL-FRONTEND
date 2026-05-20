import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Імпортуємо іконки для карток
import UploadFileIcon from '@mui/icons-material/UploadFile';
import HistoryIcon from '@mui/icons-material/History';
import SecurityIcon from '@mui/icons-material/Security';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#f8fafc',
      }}
    >
      {/* Навігаційна панель */}
      <AppBar
        position="static"
        elevation={1}
        sx={{ bgcolor: 'white', color: 'text.primary' }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 'bold', color: '#1976d2' }}
          >
            MedRecords
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button color="inherit" onClick={() => navigate('/login')}>
              Увійти
            </Button>
            <Button
              variant="contained"
              color="primary"
              disableElevation
              onClick={() => navigate('/register')}
            >
              Реєстрація
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Головний блок (Hero Section) */}
      <Box sx={{ py: 10, textAlign: 'center', px: 2 }}>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            fontWeight="800"
            sx={{ fontSize: { xs: '2.5rem', md: '3.75rem' } }}
          >
            Ваші медичні дані <br />
            <span style={{ color: '#1976d2' }}>завжди під рукою</span>
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            paragraph
            sx={{ mb: 4, fontWeight: 400 }}
          >
            Єдина безпечна веб-платформа для зберігання результатів аналізів, рецептів та
            історій хвороб. Прозорий доступ для вас та вашого лікаря.
          </Typography>
          <Button
            variant="contained"
            size="large"
            color="primary"
            sx={{ px: 5, py: 1.5, fontSize: '1.1rem', borderRadius: 2 }}
            onClick={() => navigate('/dashboard')}
          >
            Перейти до кабінету
          </Button>
        </Container>
      </Box>

      {/* Блок переваг (Features) */}
      <Container maxWidth="lg" sx={{ mb: 10, flexGrow: 1 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 4,
          }}
        >
          {/* Картка 1: Завантаження */}
          <Card
            sx={{
              height: '100%',
              textAlign: 'center',
              p: 3,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            }}
          >
            <Box sx={{ color: '#1976d2', mb: 2 }}>
              <UploadFileIcon sx={{ fontSize: 50 }} />
            </Box>
            <CardContent sx={{ p: 0 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Зберігання документів
              </Typography>
              <Typography color="text.secondary">
                Завантажуйте медичні записи, PDF-документи, знімки та результати аналізів
                у своєму профілі.
              </Typography>
            </CardContent>
          </Card>

          {/* Картка 2: Історія */}
          <Card
            sx={{
              height: '100%',
              textAlign: 'center',
              p: 3,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            }}
          >
            <Box sx={{ color: '#1976d2', mb: 2 }}>
              <HistoryIcon sx={{ fontSize: 50 }} />
            </Box>
            <CardContent sx={{ p: 0 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Історія хвороб
              </Typography>
              <Typography color="text.secondary">
                Зручний перегляд усіх медичних записів, діагнозів та планів лікування в
                єдиному кабінеті.
              </Typography>
            </CardContent>
          </Card>

          {/* Картка 3: Безпека */}
          <Card
            sx={{
              height: '100%',
              textAlign: 'center',
              p: 3,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            }}
          >
            <Box sx={{ color: '#1976d2', mb: 2 }}>
              <SecurityIcon sx={{ fontSize: 50 }} />
            </Box>
            <CardContent sx={{ p: 0 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Прозорий журнал
              </Typography>
              <Typography color="text.secondary">
                Повний контроль безпеки даних: дивіться прозорий лог, хто і коли
                переглядав вашу медичну картку.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>

      {/* Простий футер */}
      <Box
        sx={{
          bgcolor: 'white',
          py: 3,
          textAlign: 'center',
          borderTop: '1px solid #e0e0e0',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} MedRecords Platform. Усі права захищено.
        </Typography>
      </Box>
    </Box>
  );
}
