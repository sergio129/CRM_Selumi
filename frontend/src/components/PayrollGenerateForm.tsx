import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  InputAdornment,
  Switch,
  FormControlLabel,
  Tooltip
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const validationSchema = Yup.object({
  employeeId: Yup.number().required('Seleccione un empleado'),
  periodStart: Yup.date().required('Fecha de inicio requerida'),
  periodEnd: Yup.date()
    .required('Fecha de fin requerida')
    .min(Yup.ref('periodStart'), 'La fecha de fin debe ser posterior a la fecha de inicio'),
  paymentFrequency: Yup.string().required('Seleccione la frecuencia de pago'),
  paymentMethod: Yup.string().required('Seleccione el método de pago'),
  regularHours: Yup.number()
    .min(0, 'Las horas no pueden ser negativas')
    .required('Ingrese las horas trabajadas'),
  overtimeHours: Yup.number()
    .min(0, 'Las horas extra no pueden ser negativas'),
  holidayHours: Yup.number()
    .min(0, 'Las horas festivas no pueden ser negativas'),
});

const PayrollGenerateForm = ({ open, onClose, onSubmit }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [calculatedValues, setCalculatedValues] = useState({
    baseSalary: 0,
    overtimePay: 0,
    holidayPay: 0,
    totalBenefits: 0,
    totalDeductions: 0,
    netSalary: 0
  });

  useEffect(() => {
    if (open) {
      fetchEmployees();
    }
  }, [open]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('http://localhost:3001/payroll/employees', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data?.success) {
        setEmployees(response.data.data || []);
      } else {
        setError('Error al cargar empleados');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Error al cargar empleados');
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      employeeId: '',
      periodStart: '',
      periodEnd: '',
      paymentFrequency: 'monthly',
      paymentMethod: 'transfer',
      regularHours: 160, // Por defecto para mensual
      overtimeHours: 0,
      holidayHours: 0,
      benefits: {
        auxilioTransporte: true,    // Para salarios < 2 SMLV (año 2024: $140.606)
        primaServicios: true,      // Medio salario cada 6 meses
        cesantias: true,           // Un salario al año
        interesesCesantias: true,  // 12% de las cesantías
        vacaciones: true,          // 15 días hábiles al año
        bonificaciones: false,
        comisiones: false
      },
      deductions: {
        salud: true,         // 4% del salario base
        pension: true,       // 4% del salario base
        fondoSolidaridad: false, // Para salarios > 4 SMLV
        retencionFuente: false,  // Según tabla DIAN
        libranza: false,
        embargos: false,
        otros: false
      },
      bankDetails: {
        accountType: '',
        accountNumber: '',
        bankName: ''
      }
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const employeeData = values;
        
        // Calcular valores finales antes de enviar
        const employee = employees.find(e => e.id === values.employeeId);
        if (!employee) {
          throw new Error('Empleado no encontrado');
        }

        const calculations = calculatePayroll(values, employee);
        
        // Preparar datos para enviar
        const payrollData = {
          ...values,
          ...calculations,
          status: 'pendiente',
          employee: employee.id
        };

        await onSubmit(payrollData);
        onClose();
      } catch (error) {
        console.error('Error al generar nómina:', error);
        // Manejar el error apropiadamente
      }
    }
  });

  const calculatePayroll = (values, employee) => {
    const SMLV = 1300000; // Salario Mínimo Legal Vigente 2024
    const AUXILIO_TRANSPORTE = 140606; // Auxilio de Transporte 2024
    const UVT = 47065; // Valor UVT 2024

    const salarioBase = Number(employee.baseSalary);
    const horasRegulares = Number(values.regularHours);
    const horasExtra = Number(values.overtimeHours);
    const horasFestivas = Number(values.holidayHours);

    // Cálculo de horas y recargos según legislación colombiana
    const valorHora = salarioBase / 240; // 30 días x 8 horas
    const recargoDiurno = valorHora * 1.25;
    const recargoNocturno = valorHora * 1.75;
    const recargoFestivo = valorHora * 2;
    const recargoFestivoNocturno = valorHora * 2.5;

    // Cálculo de beneficios
    let totalBeneficios = 0;
    if (values.benefits.auxilioTransporte && salarioBase <= (SMLV * 2)) {
      totalBeneficios += AUXILIO_TRANSPORTE;
    }
    if (values.benefits.primaServicios) {
      totalBeneficios += (salarioBase / 12); // Provisión mensual
    }
    if (values.benefits.cesantias) {
      totalBeneficios += (salarioBase / 12); // Provisión mensual
    }
    if (values.benefits.interesesCesantias) {
      totalBeneficios += ((salarioBase / 12) * 0.12); // 12% de las cesantías
    }
    if (values.benefits.vacaciones) {
      totalBeneficios += (salarioBase / 24); // Provisión mensual (15 días)
    }

    // Cálculo de deducciones
    let totalDeducciones = 0;
    if (values.deductions.salud) {
      totalDeducciones += salarioBase * 0.04; // 4% salud
    }
    if (values.deductions.pension) {
      totalDeducciones += salarioBase * 0.04; // 4% pensión
    }
    if (values.deductions.fondoSolidaridad && salarioBase > (SMLV * 4)) {
      totalDeducciones += salarioBase * 0.01; // 1% fondo de solidaridad
    }

    // Cálculo de retención en la fuente según legislación colombiana
    let retencionFuente = 0;
    if (values.deductions.retencionFuente) {
      const esDeclarante = employee.isIncomeTaxPayer || false;
      const tarifaRetencion = esDeclarante ? 0.04 : 0.06; // 4% declarante, 6% no declarante
      
      // Base para retención: Salario - (Aportes salud + Aportes pensión)
      const aportesSalud = salarioBase * 0.04;
      const aportesPension = salarioBase * 0.04;
      const baseRetencion = salarioBase - (aportesSalud + aportesPension);
  
      // Solo aplicar retención si supera 95 UVT (2024)
      const UVT_2024 = 47065;
      const TOPE_RETENCION = UVT_2024 * 95;
  
      if (baseRetencion > TOPE_RETENCION) {
        retencionFuente = baseRetencion * tarifaRetencion;
      }
    }

    totalDeducciones += retencionFuente;

    const salarioBruto = salarioBase + totalBeneficios;
    const salarioNeto = salarioBruto - totalDeducciones;

    return {
      baseSalary: salarioBase,
      benefits: {
        auxilioTransporte: values.benefits.auxilioTransporte ? AUXILIO_TRANSPORTE : 0,
        primaServicios: values.benefits.primaServicios ? (salarioBase / 12) : 0,
        cesantias: values.benefits.cesantias ? (salarioBase / 12) : 0,
        interesesCesantias: values.benefits.interesesCesantias ? ((salarioBase / 12) * 0.12) : 0,
        vacaciones: values.benefits.vacaciones ? (salarioBase / 24) : 0,
      },
      deductions: {
        salud: values.deductions.salud ? (salarioBase * 0.04) : 0,
        pension: values.deductions.pension ? (salarioBase * 0.04) : 0,
        fondoSolidaridad: values.deductions.fondoSolidaridad ? (salarioBase * 0.01) : 0,
        retencionFuente: retencionFuente,
      },
      grossSalary: salarioBruto,
      netSalary: salarioNeto
    };
  };

  useEffect(() => {
    if (formik.values.employeeId && employees.length > 0) {
      const employee = employees.find(e => e.id === formik.values.employeeId);
      if (employee) {
        const calculated = calculatePayroll(formik.values, employee);
        setCalculatedValues(calculated);
      }
    }
  }, [formik.values, employees]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Generar Nueva Nómina</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            {error && <Alert severity="error">{error}</Alert>}

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={formik.touched.employeeId && Boolean(formik.errors.employeeId)}>
                  <InputLabel>Empleado</InputLabel>
                  <Select
                    name="employeeId"
                    {...formik.getFieldProps('employeeId')}
                    disabled={loading}
                  >
                    {loading ? (
                      <MenuItem disabled>Cargando empleados...</MenuItem>
                    ) : employees.map((employee) => (
                      <MenuItem key={employee.id} value={employee.id}>
                        {employee.fullName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Frecuencia de Pago</InputLabel>
                  <Select
                    name="paymentFrequency"
                    {...formik.getFieldProps('paymentFrequency')}
                  >
                    <MenuItem value="weekly">Semanal</MenuItem>
                    <MenuItem value="biweekly">Quincenal</MenuItem>
                    <MenuItem value="monthly">Mensual</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fecha Inicio"
                  type="date"
                  name="periodStart"
                  InputLabelProps={{ shrink: true }}
                  {...formik.getFieldProps('periodStart')}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fecha Fin"
                  type="date"
                  name="periodEnd"
                  InputLabelProps={{ shrink: true }}
                  {...formik.getFieldProps('periodEnd')}
                />
              </Grid>
            </Grid>

            <Divider />
            <Typography variant="h6">Horas Trabajadas</Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Horas Regulares"
                  type="number"
                  name="regularHours"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">hrs</InputAdornment>
                  }}
                  {...formik.getFieldProps('regularHours')}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Horas Extra"
                  type="number"
                  name="overtimeHours"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">hrs</InputAdornment>
                  }}
                  {...formik.getFieldProps('overtimeHours')}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Horas Festivas"
                  type="number"
                  name="holidayHours"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">hrs</InputAdornment>
                  }}
                  {...formik.getFieldProps('holidayHours')}
                />
              </Grid>
            </Grid>

            <Divider />
            <Typography variant="h6">Beneficios</Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.benefits.auxilioTransporte}
                      onChange={(e) => formik.setFieldValue('benefits.auxilioTransporte', e.target.checked)}
                    />
                  }
                  label="Auxilio de Transporte"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.benefits.primaServicios}
                      onChange={(e) => formik.setFieldValue('benefits.primaServicios', e.target.checked)}
                    />
                  }
                  label="Prima de Servicios"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.benefits.cesantias}
                      onChange={(e) => formik.setFieldValue('benefits.cesantias', e.target.checked)}
                    />
                  }
                  label="Cesantías"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.benefits.interesesCesantias}
                      onChange={(e) => formik.setFieldValue('benefits.interesesCesantias', e.target.checked)}
                    />
                  }
                  label="Intereses sobre Cesantías"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.benefits.vacaciones}
                      onChange={(e) => formik.setFieldValue('benefits.vacaciones', e.target.checked)}
                    />
                  }
                  label="Vacaciones"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.benefits.bonificaciones}
                      onChange={(e) => formik.setFieldValue('benefits.bonificaciones', e.target.checked)}
                    />
                  }
                  label="Bonificaciones"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.benefits.comisiones}
                      onChange={(e) => formik.setFieldValue('benefits.comisiones', e.target.checked)}
                    />
                  }
                  label="Comisiones"
                />
              </Grid>
            </Grid>

            <Divider />
            <Typography variant="h6">Deducciones</Typography>

            <Grid container spacing={2}>
              {['salud', 'pension', 'fondoSolidaridad', 'retencionFuente', 'libranza', 'embargos', 'otros'].map((deduction) => (
                <Grid item xs={12} md={6} key={deduction}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.deductions[deduction]}
                        onChange={(e) => formik.setFieldValue(`deductions.${deduction}`, e.target.checked)}
                      />
                    }
                    label={deduction.charAt(0).toUpperCase() + deduction.slice(1).replace(/([A-Z])/g, ' $1')}
                  />
                </Grid>
              ))}
            </Grid>

            <Divider />
            <Typography variant="h6">Método de Pago</Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <FormControl fullWidth>
                  <InputLabel>Método de Pago</InputLabel>
                  <Select
                    name="paymentMethod"
                    {...formik.getFieldProps('paymentMethod')}
                  >
                    <MenuItem value="transfer">Transferencia Bancaria</MenuItem>
                    <MenuItem value="cash">Efectivo</MenuItem>
                    <MenuItem value="check">Cheque</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {formik.values.paymentMethod === 'transfer' && (
                <>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Banco"
                      name="bankDetails.bankName"
                      {...formik.getFieldProps('bankDetails.bankName')}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Número de Cuenta"
                      name="bankDetails.accountNumber"
                      {...formik.getFieldProps('bankDetails.accountNumber')}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Tipo de Cuenta</InputLabel>
                      <Select
                        name="bankDetails.accountType"
                        {...formik.getFieldProps('bankDetails.accountType')}
                      >
                        <MenuItem value="savings">Ahorros</MenuItem>
                        <MenuItem value="checking">Corriente</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}
            </Grid>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Resumen de Cálculos
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Salario Base:</Typography>
                    <Typography>
                      {new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP'
                      }).format(calculatedValues.baseSalary)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Horas Extra:</Typography>
                    <Typography>
                      {new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP'
                      }).format(calculatedValues.overtimePay)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Beneficios:</Typography>
                    <Typography>
                      {new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP'
                      }).format(calculatedValues.totalBenefits)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Deducciones:</Typography>
                    <Typography color="error">
                      {new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP'
                      }).format(calculatedValues.totalDeductions)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6">
                      Salario Neto:
                      <Typography component="span" variant="h6" color="primary" sx={{ ml: 1 }}>
                        {new Intl.NumberFormat('es-CO', {
                          style: 'currency',
                          currency: 'COP'
                        }).format(calculatedValues.netSalary)}
                      </Typography>
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!formik.isValid || formik.isSubmitting || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Generar Nómina'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PayrollGenerateForm;
