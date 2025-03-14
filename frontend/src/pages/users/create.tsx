import { Container, Typography, Alert, Snackbar } from '@mui/material';
import { useState } from 'react';
import UserForm from '../../components/UserForm';
import { useRouter } from 'next/router';
import axios from 'axios';

const CreateUser = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (userData: any) => {
    try {
      // Validar campos requeridos en el frontend
      if (!userData.name || !userData.email || !userData.documentNumber || !userData.password) {
        setError('Por favor complete todos los campos requeridos');
        return;
      }

      // Asegurarse de que todos los campos necesarios se envíen
      const dataToSend = {
        ...userData,
        emergencyContact: userData.emergencyContact || null,
        emergencyPhone: userData.emergencyPhone || null
      };

      const response = await axios.post('http://localhost:3001/users', dataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setSuccessMessage('Usuario creado exitosamente');
        setTimeout(() => {
          router.push('/users');
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al crear el usuario';
      setError(errorMessage);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Crear Nuevo Usuario
      </Typography>
      <UserForm onSubmit={handleSubmit} />

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert onClose={() => setError('')} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={2000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert onClose={() => setSuccessMessage('')} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateUser;
