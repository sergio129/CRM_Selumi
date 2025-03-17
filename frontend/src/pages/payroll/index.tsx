import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  TextField,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  Print as PrintIcon,
  GetApp as DownloadIcon,
  Search as SearchIcon,
  AccountBalance as PayrollIcon,
  MonetizationOn as MoneyIcon,
  Schedule as ScheduleIcon,
  Work as WorkIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import axios from 'axios';
import PayrollGenerateForm from '../../components/PayrollGenerateForm';
import PayrollDeductionsDialog from '../../components/PayrollDeductionsDialog';

const PayrollPage = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const router = useRouter();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeductions, setShowDeductions] = useState(false);
  const [selectedPayrollForDeductions, setSelectedPayrollForDeductions] = useState(null);

  const handleExportData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/payroll/export', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'nominas.xlsx';
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      setError('Error al exportar datos');
    }
  };

  const actions = useMemo(() => [
    { icon: <AddIcon />, name: 'Nueva Nómina', action: () => setOpenForm(true) },
    { icon: <PrintIcon />, name: 'Imprimir', action: () => window.print() },
    { icon: <DownloadIcon />, name: 'Exportar', action: handleExportData }
  ], []);

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      console.log('Iniciando petición a /payroll');
      
      const response = await axios.get('http://localhost:3001/payroll', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Respuesta recibida:', response.data);

      if (response.data?.success) {
        const formattedPayrolls = response.data.data.map(payroll => ({
          ...payroll,
          baseSalary: Number(payroll.baseSalary) || 0,
          netSalary: Number(payroll.netSalary) || 0,
          employee: {
            ...payroll.employee,
            name: payroll.employee?.fullName || 'No asignado'
          }
        }));
        setPayrolls(formattedPayrolls);
      } else {
        throw new Error(response.data?.message || 'Error al cargar las nóminas');
      }
    } catch (error) {
      console.error('Error completo:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al cargar las nóminas';
      setError(errorMessage);
      setPayrolls([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchPayrolls();
  }, [router]);

  const handleGeneratePayroll = async (data) => {
    try {
      await axios.post('http://localhost:3001/payroll/generate', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setOpenForm(false); // Cerrar el formulario después de generar
      fetchPayrolls(); // Recargar la lista
    } catch (error) {
      setError('Error al generar la nómina');
    }
  };

  const calculateTotal = (items) => {
    if (!Array.isArray(items) || items.length === 0) return 0;
    return items.reduce((sum, p) => sum + (Number(p.netSalary) || 0), 0);
  };

  const calculateTotalDeductions = (items) => {
    if (!Array.isArray(items) || items.length === 0) return 0;
    return items.reduce((sum, p) => {
      if (!p.deductions) return sum;
      const deductionsTotal = Object.values(p.deductions).reduce((a, b) => a + (Number(b) || 0), 0);
      return sum + deductionsTotal;
    }, 0);
  };

  const calculateTotalBenefits = (items) => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum, p) => {
      const benefits = p.benefits || {};
      return sum + Object.values(benefits).reduce((a, b) => a + (Number(b) || 0), 0);
    }, 0);
  };

  const calculateTotalOvertimePay = (items) => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum, p) => sum + (Number(p.overtimePay) || 0), 0);
  };

  const calculateTotalOvertimeHours = (items) => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum, p) => sum + (Number(p.overtimeHours) || 0), 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return '-';
    }
  };

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return '-';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculatePercentage = (part, total) => {
    if (!part || !total || total === 0) return 0;
    return ((part / total) * 100).toFixed(1);
  };

  const getStatusChipColor = (status) => {
    const statusMap = {
      'pendiente': 'warning',
      'aprobado': 'info',
      'pagado': 'success',
      'cancelado': 'error'
    };
    return statusMap[status] || 'default';
  };

  const renderPayrollStats = () => {
    const totalPaid = calculateTotal(payrolls);
    const totalDeductions = calculateTotalDeductions(payrolls);
    const averageSalary = payrolls.length > 0 ? totalPaid / payrolls.length : 0;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" color="textSecondary">Total Pagado</Typography>
              <Typography variant="h4">{formatCurrency(totalPaid)}</Typography>
              <Typography variant="caption" color="success.main">
                {payrolls.length} nóminas generadas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" color="textSecondary">Deducciones</Typography>
              <Typography variant="h4">{formatCurrency(totalDeductions)}</Typography>
              <Typography variant="caption" color="error.main">
                {calculatePercentage(totalDeductions, totalPaid)}% del total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" color="textSecondary">Promedio Salarial</Typography>
              <Typography variant="h4">{formatCurrency(averageSalary)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderDetailedStats = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} md={3}>
        <Card sx={{ bgcolor: 'primary.light' }}>
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="h6" color="white">Nómina Total</Typography>
              <Typography variant="h4" color="white">
                {formatCurrency(calculateTotal(payrolls))}
              </Typography>
              <Typography variant="caption" color="white">
                {payrolls.length} empleados procesados
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card sx={{ bgcolor: 'warning.light' }}>
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="h6" color="white">Deducciones</Typography>
              <Typography variant="h4" color="white">
                {formatCurrency(calculateTotalDeductions(payrolls))}
              </Typography>
              <Typography variant="caption" color="white">
                Promedio: {formatCurrency(calculateTotalDeductions(payrolls) / payrolls.length || 0)}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card sx={{ bgcolor: 'success.light' }}>
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="h6" color="white">Beneficios</Typography>
              <Typography variant="h4" color="white">
                {formatCurrency(calculateTotalBenefits(payrolls))}
              </Typography>
              <Typography variant="caption" color="white">
                Por empleado: {formatCurrency(calculateTotalBenefits(payrolls) / payrolls.length || 0)}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card sx={{ bgcolor: 'info.light' }}>
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="h6" color="white">Horas Extra</Typography>
              <Typography variant="h4" color="white">
                {formatCurrency(calculateTotalOvertimePay(payrolls))}
              </Typography>
              <Typography variant="caption" color="white">
                Total horas: {calculateTotalOvertimeHours(payrolls)}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const statusOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'aprobado', label: 'Aprobado' },
    { value: 'pagado', label: 'Pagado' },
    { value: 'cancelado', label: 'Cancelado' }
  ];

  const filteredPayrolls = payrolls?.filter(payroll => {
    const matchesSearch = 
      payroll.employee?.name?.toLowerCase().includes(search.toLowerCase()) ||
      payroll.documentNumber?.includes(search);
    
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && payroll.status === filterStatus;
  }) || [];

  const handleStatusChange = async (payrollId: number, newStatus: 'pendiente' | 'aprobado' | 'pagado' | 'cancelado') => {
    try {
      setError(''); // Limpiar error previo
      console.log('Enviando actualización:', { payrollId, newStatus }); // Debug log
      
      const response = await axios.patch(
        `http://localhost:3001/payroll/${payrollId}/status`,
        { status: newStatus },
        {
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Respuesta del servidor:', response.data); // Debug log

      if (response.data.success) {
        setSuccessMessage(`Estado actualizado a ${newStatus} exitosamente`);
        await fetchPayrolls(); // Recargar datos después de actualizar
      } else {
        throw new Error(response.data.message || 'Error al actualizar estado');
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error.response || error);
      setError(error.response?.data?.message || 'Error al actualizar el estado de la nómina');
    }
  };

  const handleShowDeductions = (payroll) => {
    setSelectedPayrollForDeductions(payroll);
    setShowDeductions(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">Gestión de Nómina</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenForm(true)}
          >
            Nueva Nómina
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Buscar nómina"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: <SearchIcon />
            }}
          />
          
          <Button
            startIcon={<FilterIcon />}
            onClick={(e) => setFilterAnchorEl(e.currentTarget)}
          >
            Filtros
          </Button>

          <Button
            startIcon={<DownloadIcon />}
            onClick={handleExportData}
          >
            Exportar
          </Button>
        </Box>

        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={() => setFilterAnchorEl(null)}
        >
          {statusOptions.map(option => (
            <MenuItem
              key={option.value}
              onClick={() => {
                setFilterStatus(option.value);
                setFilterAnchorEl(null);
              }}
              selected={filterStatus === option.value}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>

        {renderDetailedStats()}

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Empleado</TableCell>
                    <TableCell>Período</TableCell>
                    <TableCell>Salario Base</TableCell>
                    <TableCell>Horas Extra</TableCell>
                    <TableCell>Deducciones</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPayrolls
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((payroll) => (
                    <TableRow key={payroll.id}>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <WorkIcon color="primary" fontSize="small" />
                          <Stack>
                            <Typography variant="body2">{payroll.employee?.name}</Typography>
                            <Typography variant="caption" color="textSecondary">
                              {payroll.employee?.position}
                            </Typography>
                          </Stack>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <ScheduleIcon color="action" fontSize="small" />
                          <Stack>
                            <Typography variant="body2">
                              {formatDate(payroll.paymentPeriodStart)}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              hasta {formatDate(payroll.paymentPeriodEnd)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </TableCell>
                      <TableCell>{formatCurrency(payroll.baseSalary)}</TableCell>
                      <TableCell>
                        <Stack>
                          <Typography variant="body2">
                            {payroll.overtimeHours || 0} horas
                          </Typography>
                          <Typography variant="caption" color="success.main">
                            +{formatCurrency(payroll.overtimePay || 0)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack>
                          <Typography variant="body2" color="error">
                            -{formatCurrency(calculateTotalDeductions([payroll]))}
                          </Typography>
                          <Tooltip title="Ver detalles de deducciones">
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                cursor: 'pointer',
                                '&:hover': {
                                  textDecoration: 'underline',
                                  color: 'primary.main'
                                }
                              }}
                              onClick={() => handleShowDeductions(payroll)}
                            >
                              Ver desglose
                            </Typography>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {formatCurrency(payroll.netSalary)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={payroll.status}
                          color={getStatusChipColor(payroll.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          {payroll.status === 'pendiente' && (
                            <>
                              <Tooltip title="Aprobar">
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={() => handleStatusChange(payroll.id, 'aprobado')}
                                >
                                  <CheckIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Rechazar">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleStatusChange(payroll.id, 'cancelado')}
                                >
                                  <CloseIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                          {payroll.status === 'aprobado' && (
                            <Tooltip title="Marcar como pagado">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleStatusChange(payroll.id, 'pagado')}
                              >
                                <PaymentIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          <IconButton
                            size="small"
                            onClick={(event) => {
                              setAnchorEl(event.currentTarget);
                              setSelectedPayroll(payroll);
                            }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={filteredPayrolls.length}
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
          </>
        )}
      </Stack>

      <SpeedDial
        ariaLabel="Acciones rápidas"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.action}
          />
        ))}
      </SpeedDial>

      <PayrollGenerateForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleGeneratePayroll}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null);
          setSelectedPayroll(null);
        }}
      >
        <MenuItem onClick={() => window.print()}>
          Imprimir Comprobante
        </MenuItem>
        <MenuItem onClick={() => handleExportData()}>
          Exportar Detalles
        </MenuItem>
        {selectedPayroll?.status === 'pagado' && (
          <MenuItem>Ver Comprobante de Pago</MenuItem>
        )}
      </Menu>

      <PayrollDeductionsDialog
        open={showDeductions}
        onClose={() => setShowDeductions(false)}
        payroll={selectedPayrollForDeductions}
      />

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert severity="success">{successMessage}</Alert>
      </Snackbar>
    </Box>
  );
};

export default PayrollPage;
