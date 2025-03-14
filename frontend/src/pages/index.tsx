import { Container, Typography } from '@mui/material';
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
    <Container>
      <Typography variant="h4" gutterBottom>
        Página Principal
      </Typography>
      <Typography variant="body1" color="primary">
        Bienvenido a CRM Selumi!
      </Typography>
    </Container>
  );
};

export default Home;
