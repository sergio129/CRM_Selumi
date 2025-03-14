import { Container, Typography, Alert, Snackbar } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import EmployeeForm from '../../../components/EmployeeForm';

const EditEmployee = () => {
  const router = useRouter();
  const { id } = router.query;
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (id) fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      if (!id || isNaN(Number(id))) {
        setError('ID de empleado inválido');
        return;
      }

      const response = await axios.get(`http://localhost:3001/payroll/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data?.success) {
        setEmployee(response.data.data);
      } else {
        setError('Error al cargar los datos del empleado');
      }
    } catch (error) {
      console.error('Error fetching employee:', error.response || error);
      setError(error.response?.data?.message || 'Error al cargar datos del empleado');
      if (error.response?.status === 404) {
        router.push('/employees');
      }
    }
  };

  const handleSubmit = async (employeeData) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/payroll/${id}`,
        employeeData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data) {
        setSuccess('Empleado actualizado exitosamente');
        setTimeout(() => {
          router.push('/employees');
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error al actualizar empleado');
    }
  };

  if (!employee) return null;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Editar Empleado
      </Typography>

      <EmployeeForm 
        onSubmit={handleSubmit} 
        initialValues={employee} 
        isEdit={true} 
      />

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

export default EditEmployee;
