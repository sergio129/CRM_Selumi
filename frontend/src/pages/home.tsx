import { Container, Typography, Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box sx={{ padding: '2rem' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" gutterBottom>
          Bienvenido a CRM Selumi
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Sistema de Gestión de Relaciones con Clientes
        </Typography>
        {user && (
          <Typography variant="body1" color="primary">
            Sesión iniciada como: {user.name || user.documentNumber}
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default Home;
