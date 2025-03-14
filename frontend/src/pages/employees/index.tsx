import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
  IconButton,
  TextField,
  TablePagination,
  Chip,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchEmployees();
  }, [router]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.get('http://localhost:3001/payroll', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Verificar la estructura de la respuesta y los datos
      console.log('API Response:', response.data);

      if (response.data && Array.isArray(response.data)) {
        // Si la respuesta es directamente un array
        setEmployees(response.data);
      } else if (response.data?.success && Array.isArray(response.data.data)) {
        // Si la respuesta tiene la estructura {success, data, message}
        setEmployees(response.data.data);
      } else {
        console.error('Formato de respuesta inválido:', response.data);
        setEmployees([]);
        setError('Error en el formato de datos');
      }
    } catch (error) {
      console.error('Error details:', error.response || error);
      setError(error.response?.data?.message || 'Error al cargar empleados');
      if (error.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este empleado?')) {
      try {
        await axios.delete(`http://localhost:3001/payroll/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchEmployees();
      } catch (error) {
        setError('Error al eliminar empleado');
      }
    }
  };

  const filteredEmployees = employees?.filter(emp => 
    emp.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    emp.documentNumber?.includes(search) ||
    emp.position?.toLowerCase().includes(search.toLowerCase())
  );

  const formatSalary = (salary: any) => {
    // Convertir a número y manejar diferentes formatos
    const numericSalary = typeof salary === 'string' ? parseFloat(salary) : salary;
    return !isNaN(numericSalary) ? numericSalary.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }) : '$0';
  };

  return (
    <Container>
      <Stack spacing={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Empleados</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/employees/create')}
          >
            Nuevo Empleado
          </Button>
        </Box>

        <TextField
          label="Buscar empleado"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: <SearchIcon />
          }}
        />

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Documento</TableCell>
                  <TableCell>Cargo</TableCell>
                  <TableCell>Departamento</TableCell>
                  <TableCell>Salario Base</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>{employee.fullName}</TableCell>
                        <TableCell>{`${employee.documentType} ${employee.documentNumber}`}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>
                          {formatSalary(employee.baseSalary)}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => router.push(`/employees/edit/${employee.id}`)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(employee.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No hay empleados para mostrar
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={filteredEmployees.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              labelRowsPerPage="Filas por página"
            />
          </TableContainer>
        )}
      </Stack>
    </Container>
  );
};

export default Employees;
