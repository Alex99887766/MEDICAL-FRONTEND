import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HistoryIcon from '@mui/icons-material/History';
import SecurityIcon from '@mui/icons-material/Security';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';

const drawerWidth = 260;

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    // Видаляємо токен із пам'яті браузера
    localStorage.removeItem('token');

    // Перекидаємо на сторінку входу
    navigate('/login');
  };

  // Конфігурація пунктів меню
  const menuItems = [
    { text: 'Головна', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Мій профіль', icon: <PersonIcon />, path: '/dashboard/profile' },
    { text: 'Історія хвороб', icon: <HistoryIcon />, path: '/dashboard/history' },
    { text: 'Журнал безпеки', icon: <SecurityIcon />, path: '/dashboard/security' },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" color="primary" fontWeight="bold">
          MedRecords
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false); // Закриваємо меню на мобільних після кліку
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? 'primary.main' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {/* Нова кнопка "На головну" */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/')} sx={{ color: 'text.secondary' }}>
            <ListItemIcon sx={{ color: 'inherit' }}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="На головну" />
          </ListItemButton>
        </ListItem>

        {/* Існуюча кнопка виходу */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ color: 'error.main' }}>
            <ListItemIcon sx={{ color: 'error.main' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Вийти" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Верхня панель */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Кабінет Користувача
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Бічне меню (Sidebar) */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        {/* Мобільна версія (ховається) */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        {/* Десктопна версія (постійна) */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Основний контент сторінки */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: '#f8fafc',
          minHeight: '100vh',
        }}
      >
        <Toolbar /> {/* Відступ під AppBar */}
        {/* Саме сюди React Router буде підставляти ваші сторінки */}
        <Outlet />
      </Box>
    </Box>
  );
}
