import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';

const validationSchema = Yup.object({
  employeeId: Yup.number().required('Seleccione un empleado'),
  periodStart: Yup.date().required('Fecha de inicio requerida'),
  periodEnd: Yup.date().required('Fecha de fin requerida'),
});

const PayrollGenerateForm = ({ open, onClose, onSubmit }) => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:3001/payroll/employees', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const formik = useFormik({
    initialValues: {
      employeeId: '',
      periodStart: '',
      periodEnd: '',
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
      formik.resetForm();
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Generar Nómina</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            <FormControl fullWidth error={formik.touched.employeeId && Boolean(formik.errors.employeeId)}>
              <InputLabel>Empleado</InputLabel>
              <Select
                name="employeeId"
                value={formik.values.employeeId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {employees.map((employee) => (
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.employeeId && formik.errors.employeeId && (
                <FormHelperText>{formik.errors.employeeId}</FormHelperText>
              )}
            </FormControl>

            <TextField
              fullWidth
              label="Fecha Inicio"
              type="date"
              name="periodStart"
              value={formik.values.periodStart}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.periodStart && Boolean(formik.errors.periodStart)}
              helperText={formik.touched.periodStart && formik.errors.periodStart}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              label="Fecha Fin"
              type="date"
              name="periodEnd"
              value={formik.values.periodEnd}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.periodEnd && Boolean(formik.errors.periodEnd)}
              helperText={formik.touched.periodEnd && formik.errors.periodEnd}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Generar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PayrollGenerateForm;
