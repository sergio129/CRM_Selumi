import { Container, Typography, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import UserForm from '../../../components/UserForm';

const EditUser = () => {
  const router = useRouter();
  const { id } = router.query;
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (id) {
      fetchUserData();
    }
  }, [id]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        // Asegurarse de que todos los campos necesarios estén presentes
        const userData = {
          ...response.data.data,
          birthDate: response.data.data.birthDate ? 
            new Date(response.data.data.birthDate).toISOString().split('T')[0] : 
            null,
          isEdit: true
        };
        setUserData(userData);
      }
    } catch (error) {
      setError('Error al cargar los datos del usuario');
      console.error('Error fetching user:', error);
    }
  };

  const handleSubmit = async (updatedData: any) => {
    try {
      const cleanedData = {
        name: updatedData.name,
        email: updatedData.email,
        documentNumber: updatedData.documentNumber,
        phoneNumber: updatedData.phoneNumber,
        role: updatedData.role,
        address: updatedData.address,
        birthDate: updatedData.birthDate,
        position: updatedData.position,
        department: updatedData.department,
        emergencyContact: updatedData.emergencyContact,    // Añadido
        emergencyPhone: updatedData.emergencyPhone,        // Añadido
      };

      const response = await axios.put(
        `http://localhost:3001/users/${id}`,
        cleanedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setSuccess('Usuario actualizado exitosamente');
        setTimeout(() => {
          router.push('/users');
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error al actualizar usuario');
    }
  };

  if (!userData) return null;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Editar Usuario
      </Typography>
      <UserForm onSubmit={handleSubmit} initialData={userData} isEdit={true} />

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

export default EditUser;
