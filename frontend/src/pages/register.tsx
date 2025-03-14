import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Container, TextField, Button, Typography, Snackbar, Alert } from '@mui/material';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:3001/auth/register', { name, email, password, documentNumber });
      setOpen(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error al registrar');
      console.error('Error al registrar', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Registrarse
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Número de Documento"
          value={documentNumber}
          onChange={(e) => setDocumentNumber(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Registrarse
        </Button>
      </form>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Registro exitoso!
        </Alert>
      </Snackbar>
      {error && (
        <Snackbar open={true} autoHideDuration={2000} onClose={() => setError('')}>
          <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default Register;
