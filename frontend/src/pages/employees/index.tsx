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
  CircularProgress,
  Menu,
  MenuItem,
  Tooltip,
  Card,
  CardContent,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Badge,
  Divider,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  CardHeader,
  CardActions,
  Avatar
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Search as SearchIcon,
  FilterList as FilterIcon, 
  GetApp as ExportIcon,
  ViewList as ListIcon,
  ViewModule as GridIcon,
  QrCode as QrCodeIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

// Hacer la importación condicional
let QRCode;
if (typeof window !== 'undefined') {
  QRCode = require('qrcode.react').default;
}

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const departments = [...new Set(employees.map(emp => emp.department))];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    console.log('Componente Employees montado');
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      console.log('Iniciando fetch de empleados'); // Debug log

      const response = await axios.get('http://localhost:3001/payroll/employees', { // Cambiado de /payroll a /payroll/employees
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Respuesta del servidor:', response.data); // Debug log

      if (response.data?.success) {
        setEmployees(response.data.data || []);
      } else {
        console.error('Formato de respuesta inválido:', response.data);
        setEmployees([]);
        setError('Error en el formato de datos');
      }
    } catch (error) {
      console.error('Error completo:', error);
      setError(error.response?.data?.message || 'Error al cargar empleados');
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

  const handleExportData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/payroll/export', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'empleados.xlsx';
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      setError('Error al exportar datos');
    }
  };

  const sortEmployees = (employees) => {
    return [...employees].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.fullName.localeCompare(b.fullName);
        case 'salary':
          return b.baseSalary - a.baseSalary;
        case 'department':
          return a.department.localeCompare(b.department);
        default:
          return 0;
      }
    });
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

  const renderGridView = () => (
    <Grid container spacing={2}>
      {filteredEmployees.map((employee) => (
        <Grid item xs={12} sm={6} md={4} key={employee.id}>
          <Card>
            <CardHeader
              avatar={
                <Avatar>{employee.fullName[0]}</Avatar>
              }
              title={employee.fullName}
              subheader={employee.position}
            />
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  Departamento: {employee.department}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Salario: {formatSalary(employee.baseSalary)}
                </Typography>
                <Chip 
                  label={employee.contractType}
                  color={employee.contractType === 'Indefinido' ? 'success' : 'info'}
                />
              </Stack>
            </CardContent>
            <CardActions>
              <IconButton onClick={() => router.push(`/employees/edit/${employee.id}`)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => setSelectedEmployee(employee)}>
                <VisibilityIcon />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderEmployeeStats = () => (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Empleados</Typography>
              <Typography variant="h3">{employees.length}</Typography>
              <LinearProgress 
                variant="determinate" 
                value={(employees.length / 100) * 100} 
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Promedio Salarial</Typography>
              <Typography variant="h3">
                {formatSalary(
                  employees.reduce((acc, emp) => acc + Number(emp.baseSalary), 0) / employees.length
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Más estadísticas... */}
      </Grid>
    </Box>
  );

  const renderEmployeeTimeline = (employee) => (
    <Timeline>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="primary" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Typography variant="h6">Contratación</Typography>
          <Typography>{new Date(employee.hireDate).toLocaleDateString()}</Typography>
        </TimelineContent>
      </TimelineItem>
      {/* Más eventos... */}
    </Timeline>
  );

  const actions = [
    { icon: <AddIcon />, name: 'Nuevo', action: () => router.push('/employees/create') },
    { icon: <ExportIcon />, name: 'Exportar', action: handleExportData },
    { icon: <QrCodeIcon />, name: 'Generar QR', action: () => setShowQRDialog(true) },
  ];

  // Modificar el diálogo QR para ser condicional
  const renderQRDialog = () => {
    if (!QRCode) return null;
    
    return (
      <Dialog open={showQRDialog} onClose={() => setShowQRDialog(false)}>
        <DialogTitle>Código QR del Empleado</DialogTitle>
        <DialogContent>
          {selectedEmployee && (
            <QRCode
              value={JSON.stringify({
                id: selectedEmployee.id,
                name: selectedEmployee.fullName,
                position: selectedEmployee.position
              })}
              size={256}
              level="H"
              includeMargin={true}
            />
          )}
        </DialogContent>
      </Dialog>
    );
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

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
          
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, value) => value && setViewMode(value)}
            size="small"
          >
            <ToggleButton value="list">
              <ListIcon />
            </ToggleButton>
            <ToggleButton value="grid">
              <GridIcon />
            </ToggleButton>
          </ToggleButtonGroup>

          <Button
            startIcon={<FilterIcon />}
            onClick={(e) => setFilterAnchorEl(e.currentTarget)}
          >
            Filtros
          </Button>

          <Button
            startIcon={<ExportIcon />}
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
          <MenuItem disabled>
            <Typography variant="subtitle2">Ordenar por</Typography>
          </MenuItem>
          <MenuItem onClick={() => setSortBy('name')}>Nombre</MenuItem>
          <MenuItem onClick={() => setSortBy('salary')}>Salario</MenuItem>
          <MenuItem onClick={() => setSortBy('department')}>Departamento</MenuItem>
          <Divider />
          <MenuItem disabled>
            <Typography variant="subtitle2">Departamento</Typography>
          </MenuItem>
          <MenuItem onClick={() => setFilterDepartment('all')}>Todos</MenuItem>
          {departments.map(dept => (
            <MenuItem 
              key={dept} 
              onClick={() => setFilterDepartment(dept)}
            >
              {dept}
            </MenuItem>
          ))}
        </Menu>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          viewMode === 'list' ? (
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
          ) : (
            renderGridView()
          )
        )}

        {/* SpeedDial para acciones rápidas */}
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

        {/* Reemplazar el diálogo QR existente con el renderizado condicional */}
        {renderQRDialog()}
      </Stack>
    </Container>
  );
};

export default Employees;
