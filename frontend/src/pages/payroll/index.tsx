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
  Alert,
  Dialog,
  IconButton,
  Box,
  Chip,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Print as PrintIcon, GetApp as GetAppIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import PayrollGenerateForm from '../../components/PayrollGenerateForm';
import axios from 'axios';

const PayrollPage = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/payroll', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPayrolls(response.data);
    } catch (error) {
      setError('Error al cargar las nóminas');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePayroll = async (data) => {
    try {
      await axios.post('http://localhost:3001/payroll/generate', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setOpenForm(false);
      fetchPayrolls();
    } catch (error) {
      setError('Error al generar la nómina');
    }
  };

  return (
    <Container>
      <Stack spacing={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Gestión de Nómina</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenForm(true)}
          >
            Generar Nómina
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Resumen
          </Typography>
          <Stack direction="row" spacing={2}>
            <Box flex={1} textAlign="center">
              <Typography variant="h4">{payrolls.length}</Typography>
              <Typography color="textSecondary">Total Nóminas</Typography>
            </Box>
            <Box flex={1} textAlign="center">
              <Typography variant="h4">
                ${payrolls.reduce((sum, p) => sum + (p.totalAmount || 0), 0).toLocaleString()}
              </Typography>
              <Typography color="textSecondary">Total Pagado</Typography>
            </Box>
          </Stack>
        </Paper>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Período</TableCell>
                  <TableCell>Empleado</TableCell>
                  <TableCell>Salario Base</TableCell>
                  <TableCell>Deducciones</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payrolls.map((payroll) => (
                  <TableRow key={payroll.id}>
                    <TableCell>
                      {new Date(payroll.paymentPeriodStart).toLocaleDateString()} -
                      {new Date(payroll.paymentPeriodEnd).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{payroll.employee?.name}</TableCell>
                    <TableCell>${payroll.baseSalary?.toLocaleString()}</TableCell>
                    <TableCell>${payroll.totalDeductions?.toLocaleString()}</TableCell>
                    <TableCell>${payroll.netSalary?.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={payroll.status}
                        color={payroll.status === 'paid' ? 'success' : 'warning'}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => window.print()}>
                        <PrintIcon />
                      </IconButton>
                      <IconButton>
                        <GetAppIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Stack>

      <PayrollGenerateForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleGeneratePayroll}
      />
    </Container>
  );
};

export default PayrollPage;
