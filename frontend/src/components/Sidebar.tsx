import { useState } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  IconButton,
  styled,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WorkIcon from '@mui/icons-material/Work';
import SecurityIcon from '@mui/icons-material/Security';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import ReportIcon from '@mui/icons-material/Report';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EventIcon from '@mui/icons-material/Event';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useRouter } from 'next/router';
import axios from 'axios';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const [refreshDialogOpen, setRefreshDialogOpen] = useState(false);
  const [refreshError, setRefreshError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleRefreshSession = async () => {
    try {
      setRefreshing(true);
      const response = await axios.post('http://localhost:3001/auth/refresh', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        setRefreshDialogOpen(false);
      }
    } catch (error) {
      setRefreshError('Error al renovar sesión. Por favor, inicie sesión nuevamente.');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } finally {
      setRefreshing(false);
    }
  };

  const menuItems = [
    { text: 'Inicio', icon: <HomeIcon />, path: '/' },
    { text: 'Usuarios', icon: <PeopleIcon />, path: '/users' },
    { text: 'Empleados', icon: <WorkIcon />, path: '/employees' }, // Agregado nuevo ítem
    { text: 'Clientes', icon: <PeopleIcon />, path: '/clients' },
    { text: 'Contabilidad', icon: <AccountBalanceIcon />, path: '/accounting' },
    { text: 'Préstamos', icon: <AttachMoneyIcon />, path: '/loans' },
    { text: 'Nómina', icon: <WorkIcon />, path: '/payroll' },
    { text: 'Roles', icon: <SecurityIcon />, path: '/roles' },
    { text: 'Biometría', icon: <FingerprintIcon />, path: '/biometric' },
    { text: 'Reportes', icon: <ReportIcon />, path: '/reports' },
    { text: 'Notificaciones', icon: <NotificationsIcon />, path: '/notifications' },
    { text: 'Asistencia', icon: <EventIcon />, path: '/attendance' },
  ];

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerToggle}
        edge="start"
        sx={{
          position: 'fixed',
          left: open ? 240 : 20,
          top: 20,
          zIndex: 1300,
          bgcolor: 'background.paper',
          boxShadow: 1,
          '&:hover': {
            bgcolor: 'grey.100',
          },
        }}
      >
        {open ? <ChevronLeftIcon /> : <MenuIcon />}
      </IconButton>
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <DrawerHeader>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            CRM Selumi
          </Typography>
        </DrawerHeader>
        <List>
          {menuItems.map((item, index) => (
            <ListItem 
              button 
              key={index} 
              onClick={() => router.push(item.path)}
              selected={router.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
          <ListItem>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => setRefreshDialogOpen(true)}
            >
              Renovar Sesión
            </Button>
          </ListItem>
        </List>
      </Drawer>

      <Dialog open={refreshDialogOpen} onClose={() => setRefreshDialogOpen(false)}>
        <DialogTitle>Renovar Sesión</DialogTitle>
        <DialogContent>
          ¿Desea renovar su sesión actual?
          {refreshError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {refreshError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRefreshDialogOpen(false)}>Cancelar</Button>
          <Button 
            onClick={handleRefreshSession}
            disabled={refreshing}
            variant="contained"
          >
            {refreshing ? 'Renovando...' : 'Renovar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sidebar;
