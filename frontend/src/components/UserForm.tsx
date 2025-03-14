import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Avatar,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider,
  Box,
  Stack,
  Chip,
  InputAdornment,
  LinearProgress,
  Tooltip,
  Typography,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import {
  Person,
  ContactMail,
  Security,
  Work,
  ContactPhone,
  LocationOn,
  MedicalInformation,
  Badge,
} from '@mui/icons-material';

interface UserFormProps {
  onSubmit: (userData: any) => void;
  initialData?: any;
  isEdit?: boolean;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .required('El nombre es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: Yup.string()
    .email('Email inválido')
    .required('El email es requerido'),
  documentNumber: Yup.string()
    .required('El número de documento es requerido')
    .min(5, 'El número de documento debe tener al menos 5 caracteres'),
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, 'Solo se permiten números')
    .nullable(),
  role: Yup.string()
    .required('El rol es requerido'),
  password: Yup.string()
    .test('password-validation', '', function (value) {
      if (!this.parent.isEdit && !value) {
        return this.createError({
          message: 'La contraseña es requerida'
        });
      }
      if (!this.parent.isEdit && value) {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
        if (!passwordRegex.test(value)) {
          return this.createError({
            message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial'
          });
        }
      }
      return true;
    }),
  address: Yup.string().nullable(),
  birthDate: Yup.date()
    .nullable()
    .max(new Date(), 'La fecha no puede ser futura'),
  emergencyContact: Yup.string()
    .min(3, 'El contacto de emergencia debe tener al menos 3 caracteres')
    .nullable(),
  emergencyPhone: Yup.string()
    .matches(/^[0-9]+$/, 'Solo se permiten números')
    .min(7, 'El teléfono debe tener al menos 7 dígitos')
    .nullable(),
  position: Yup.string()
    .min(3, 'La posición debe tener al menos 3 caracteres')
    .nullable(),
  department: Yup.string()
    .min(3, 'El departamento debe tener al menos 3 caracteres')
    .nullable(),
  profilePicture: Yup.string().nullable()
});

const UserForm = ({ onSubmit, initialData = {}, isEdit = false }: UserFormProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [avatarPreview, setAvatarPreview] = useState(initialData.profilePicture || '');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const steps = [
    { label: 'Información Personal', icon: <Person /> },
    { label: 'Contacto y Ubicación', icon: <ContactMail /> },
    { label: 'Información Laboral', icon: <Work /> },
    { label: 'Seguridad', icon: <Security /> },
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Verificar el tamaño del archivo
      if (file.size > 5000000) { // 5MB
        alert('La imagen es demasiado grande. El tamaño máximo es 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // Comprimir la imagen antes de guardarla
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          let width = img.width;
          let height = img.height;

          // Calcular las nuevas dimensiones manteniendo la proporción
          if (width > 800) {
            height = height * (800 / width);
            width = 800;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Convertir a JPEG con calidad reducida
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
          setAvatarPreview(compressedDataUrl);
          formik.setFieldValue('profilePicture', compressedDataUrl);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: initialData.name || '',
      email: initialData.email || '',
      documentNumber: initialData.documentNumber || '',
      phoneNumber: initialData.phoneNumber || '',
      role: initialData.role || 'user',
      password: '',
      isEdit,
      address: initialData.address || '',
      birthDate: initialData.birthDate || null,
      emergencyContact: initialData.emergencyContact || '',
      emergencyPhone: initialData.emergencyPhone || '',
      position: initialData.position || '',
      department: initialData.department || '',
      profilePicture: initialData.profilePicture || '',
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[!@#$%^&*]/)) strength += 25;
    setPasswordStrength(strength);
  };

  const isStepValid = (step: number) => {
    const stepFields = {
      0: ['name', 'documentNumber', 'birthDate'],
      1: ['email', 'phoneNumber', 'address'],
      2: ['position', 'department', 'emergencyContact', 'emergencyPhone'],
      3: ['role', 'password']
    };

    const currentFields = stepFields[step];
    const touchedFields = currentFields.some(field => formik.touched[field]);
    const validFields = currentFields.every(field => {
      // Si el campo es password y estamos en modo edición, no es requerido
      if (field === 'password' && isEdit) return true;
      // Si el campo está vacío y no es requerido, es válido
      if (!formik.values[field] && !validationSchema.fields[field].spec.presence) return true;
      // Si el campo tiene valor, validar que no tenga errores
      return formik.values[field] && !formik.errors[field];
    });

    return !touchedFields || validFields;
  };

  const handleNext = () => {
    const currentFields = {
      0: ['name', 'documentNumber', 'birthDate'],
      1: ['email', 'phoneNumber', 'address'],
      2: ['position', 'department', 'emergencyContact', 'emergencyPhone'],
      3: ['role', 'password']
    }[activeStep];

    // Marcar campos del paso actual como touched
    currentFields.forEach(field => {
      formik.setFieldTouched(field, true);
    });

    // Validar campos del paso actual
    const hasErrors = currentFields.some(field => formik.errors[field]);
    
    if (!hasErrors) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Box display="flex" justifyContent="center">
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="icon-button-file"
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="icon-button-file">
                    <Tooltip title="Cambiar foto de perfil">
                      <IconButton component="span">
                        <Avatar
                          src={avatarPreview}
                          sx={{ width: 120, height: 120 }}
                        />
                        <PhotoCamera sx={{ position: 'absolute', bottom: 5, right: 5, backgroundColor: 'white', borderRadius: '50%', padding: '4px' }} />
                      </IconButton>
                    </Tooltip>
                  </label>
                </Box>
                <TextField
                  fullWidth
                  label="Nombre Completo"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Badge />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Número de Documento"
                  name="documentNumber"
                  value={formik.values.documentNumber}
                  onChange={formik.handleChange}
                  error={formik.touched.documentNumber && Boolean(formik.errors.documentNumber)}
                  helperText={formik.touched.documentNumber && formik.errors.documentNumber}
                />
                <TextField
                  fullWidth
                  label="Fecha de Nacimiento"
                  name="birthDate"
                  type="date"
                  value={formik.values.birthDate || ''}
                  onChange={formik.handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
            </CardContent>
          </Card>
        );
      case 1:
        return (
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ContactMail />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Teléfono"
                  name="phoneNumber"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                  helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ContactPhone />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Dirección"
                  name="address"
                  multiline
                  rows={3}
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Contacto de Emergencia"
                  name="emergencyContact"
                  value={formik.values.emergencyContact}
                  onChange={formik.handleChange}
                  error={formik.touched.emergencyContact && Boolean(formik.errors.emergencyContact)}
                  helperText={formik.touched.emergencyContact && formik.errors.emergencyContact}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MedicalInformation />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Teléfono de Emergencia"
                  name="emergencyPhone"
                  value={formik.values.emergencyPhone}
                  onChange={formik.handleChange}
                  error={formik.touched.emergencyPhone && Boolean(formik.errors.emergencyPhone)}
                  helperText={formik.touched.emergencyPhone && formik.errors.emergencyPhone}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ContactPhone color="error" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Cargo"
                  name="position"
                  value={formik.values.position}
                  onChange={formik.handleChange}
                  error={formik.touched.position && Boolean(formik.errors.position)}
                  helperText={formik.touched.position && formik.errors.position}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Work />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Departamento"
                  name="department"
                  value={formik.values.department}
                  onChange={formik.handleChange}
                  error={formik.touched.department && Boolean(formik.errors.department)}
                  helperText={formik.touched.department && formik.errors.department}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Badge />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <FormControl fullWidth error={formik.touched.role && Boolean(formik.errors.role)}>
                  <InputLabel>Rol</InputLabel>
                  <Select
                    name="role"
                    value={formik.values.role}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="user">Usuario</MenuItem>
                    <MenuItem value="admin">Administrador</MenuItem>
                    <MenuItem value="manager">Gerente</MenuItem>
                  </Select>
                  {formik.touched.role && formik.errors.role && (
                    <FormHelperText>{formik.errors.role}</FormHelperText>
                  )}
                </FormControl>
                {!isEdit && (
                  <>
                    <TextField
                      fullWidth
                      label="Contraseña"
                      name="password"
                      type="password"
                      value={formik.values.password}
                      onChange={(e) => {
                        formik.handleChange(e);
                        checkPasswordStrength(e.target.value);
                      }}
                      error={formik.touched.password && Boolean(formik.errors.password)}
                      helperText={formik.touched.password && formik.errors.password}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Security />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <LinearProgress
                      variant="determinate"
                      value={passwordStrength}
                      sx={{
                        height: 8,
                        borderRadius: 5,
                        backgroundColor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: 
                            passwordStrength <= 25 ? 'error.main' :
                            passwordStrength <= 50 ? 'warning.main' :
                            passwordStrength <= 75 ? 'info.main' :
                            'success.main',
                        },
                      }}
                    />
                    <Typography variant="caption" color="textSecondary">
                      Fortaleza de la contraseña: {
                        passwordStrength <= 25 ? 'Débil' :
                        passwordStrength <= 50 ? 'Regular' :
                        passwordStrength <= 75 ? 'Buena' :
                        'Fuerte'
                      }
                    </Typography>
                  </>
                )}
              </Stack>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              StepIconComponent={() => (
                <Avatar sx={{ bgcolor: activeStep >= index ? 'primary.main' : 'grey.300' }}>
                  {step.icon}
                </Avatar>
              )}
            >
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4 }}>
        <form onSubmit={formik.handleSubmit}>
          {renderStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={() => setActiveStep((prev) => prev - 1)}
              variant="outlined"
            >
              Anterior
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!formik.isValid}
              >
                {isEdit ? 'Actualizar' : 'Crear'} Usuario
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!isStepValid(activeStep)}
              >
                Siguiente
              </Button>
            )}
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default UserForm;
