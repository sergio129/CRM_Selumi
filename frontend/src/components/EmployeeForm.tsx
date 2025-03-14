import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack,
  Divider,
  Typography
} from '@mui/material';

const validationSchema = Yup.object({
  fullName: Yup.string()
    .required('El nombre es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  documentType: Yup.string()
    .required('El tipo de documento es requerido'),
  documentNumber: Yup.string()
    .required('El número de documento es requerido'),
  email: Yup.string()
    .email('Email inválido')
    .required('El email es requerido'),
  baseSalary: Yup.number()
    .required('El salario base es requerido')
    .min(0, 'El salario no puede ser negativo'),
  position: Yup.string()
    .required('El cargo es requerido'),
  department: Yup.string()
    .required('El departamento es requerido'),
  contractType: Yup.string()
    .required('El tipo de contrato es requerido'),
});

const EmployeeForm = ({ onSubmit, initialValues = {}, isEdit = false }) => {
  const formik = useFormik({
    initialValues: {
      fullName: '',
      documentType: '',
      documentNumber: '',
      address: '',
      phone: '',
      email: '',
      birthDate: '',
      gender: '',
      position: '',
      department: '',
      hireDate: '',
      contractType: '',
      supervisor: '',
      baseSalary: '',
      benefits: {
        healthInsurance: 0,
        transportationAllowance: 0,
        mealAllowance: 0,
        performanceBonus: 0
      },
      bankName: '',
      bankAccountNumber: '',
      bankAccountType: '',
      ...initialValues,
      // Formatear fechas para el input type="date"
      birthDate: initialValues.birthDate ? new Date(initialValues.birthDate).toISOString().split('T')[0] : '',
      hireDate: initialValues.hireDate ? new Date(initialValues.hireDate).toISOString().split('T')[0] : '',
      // Asegurar que baseSalary sea un número
      baseSalary: initialValues.baseSalary ? Number(initialValues.baseSalary) : ''
    },
    validationSchema,
    onSubmit: (values) => {
      // Asegurar que los datos se envían en el formato correcto
      const formattedValues = {
        ...values,
        baseSalary: Number(values.baseSalary),
        birthDate: values.birthDate ? new Date(values.birthDate).toISOString() : null,
        hireDate: values.hireDate ? new Date(values.hireDate).toISOString() : null
      };
      onSubmit(formattedValues);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Información Personal
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre Completo *"
                  name="fullName"
                  {...formik.getFieldProps('fullName')}
                  error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                  helperText={formik.touched.fullName && formik.errors.fullName}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Documento *</InputLabel>
                  <Select
                    name="documentType"
                    {...formik.getFieldProps('documentType')}
                    error={formik.touched.documentType && Boolean(formik.errors.documentType)}
                  >
                    <MenuItem value="CC">Cédula de Ciudadanía</MenuItem>
                    <MenuItem value="CE">Cédula de Extranjería</MenuItem>
                    <MenuItem value="PP">Pasaporte</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Número de Documento *"
                  name="documentNumber"
                  {...formik.getFieldProps('documentNumber')}
                  error={formik.touched.documentNumber && Boolean(formik.errors.documentNumber)}
                  helperText={formik.touched.documentNumber && formik.errors.documentNumber}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email *"
                  name="email"
                  type="email"
                  {...formik.getFieldProps('email')}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  name="phone"
                  {...formik.getFieldProps('phone')}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Fecha de Nacimiento"
                  name="birthDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...formik.getFieldProps('birthDate')}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Información Laboral
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cargo *"
                  name="position"
                  {...formik.getFieldProps('position')}
                  error={formik.touched.position && Boolean(formik.errors.position)}
                  helperText={formik.touched.position && formik.errors.position}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Departamento *"
                  name="department"
                  {...formik.getFieldProps('department')}
                  error={formik.touched.department && Boolean(formik.errors.department)}
                  helperText={formik.touched.department && formik.errors.department}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Salario Base *"
                  name="baseSalary"
                  type="number"
                  {...formik.getFieldProps('baseSalary')}
                  error={formik.touched.baseSalary && Boolean(formik.errors.baseSalary)}
                  helperText={formik.touched.baseSalary && formik.errors.baseSalary}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Contrato *</InputLabel>
                  <Select
                    name="contractType"
                    {...formik.getFieldProps('contractType')}
                    error={formik.touched.contractType && Boolean(formik.errors.contractType)}
                  >
                    <MenuItem value="Indefinido">Indefinido</MenuItem>
                    <MenuItem value="Fijo">Término Fijo</MenuItem>
                    <MenuItem value="Temporal">Temporal</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fecha de Contratación"
                  name="hireDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...formik.getFieldProps('hireDate')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Supervisor"
                  name="supervisor"
                  {...formik.getFieldProps('supervisor')}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Información Bancaria
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Banco"
                  name="bankName"
                  {...formik.getFieldProps('bankName')}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Número de Cuenta"
                  name="bankAccountNumber"
                  {...formik.getFieldProps('bankAccountNumber')}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Cuenta</InputLabel>
                  <Select
                    name="bankAccountType"
                    {...formik.getFieldProps('bankAccountType')}
                  >
                    <MenuItem value="Savings">Ahorros</MenuItem>
                    <MenuItem value="Checking">Corriente</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Button type="submit" variant="contained" color="primary" size="large">
          {isEdit ? 'Actualizar' : 'Crear'} Empleado
        </Button>
      </Stack>
    </form>
  );
};

export default EmployeeForm;
