import { Container, Typography, Alert, Snackbar } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import EmployeeForm from '../../components/EmployeeForm';

const CreateEmployee = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (employeeData) => {
    try {
      const response = await axios.post('http://localhost:3001/payroll', employeeData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data) {
        setSuccess('Empleado creado exitosamente');
        setTimeout(() => {
          router.push('/employees');
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error al crear empleado');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Crear Nuevo Empleado
      </Typography>

      <EmployeeForm onSubmit={handleSubmit} />

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={2000}
        onClose={() => setSuccess('')}
      >
        <Alert severity="success">{success}</Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateEmployee;
