import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TextField,
  Stack,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';

const PayrollReportGenerator = ({ open, onClose }) => {
  const [reportType, setReportType] = useState('summary');
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [format, setFormat] = useState('pdf');
  const [includeFields, setIncludeFields] = useState({
    personalInfo: true,
    salary: true,
    deductions: true,
    benefits: true,
    attendance: false,
    loans: false
  });

  const generateReport = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3001/payroll/reports/generate',
        {
          type: reportType,
          dateRange,
          format,
          includeFields
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          responseType: 'blob'
        }
      );

      // Crear y descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte-nomina-${new Date().toISOString()}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error generando reporte:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Generar Reporte de Nómina</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Tipo de Reporte</InputLabel>
            <Select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <MenuItem value="summary">Resumen General</MenuItem>
              <MenuItem value="detailed">Detallado por Empleado</MenuItem>
              <MenuItem value="deductions">Deducciones</MenuItem>
              <MenuItem value="benefits">Beneficios</MenuItem>
              <MenuItem value="attendance">Asistencia</MenuItem>
            </Select>
          </FormControl>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Fecha Inicio"
                value={dateRange.start}
                onChange={(date) => setDateRange({ ...dateRange, start: date })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Fecha Fin"
                value={dateRange.end}
                onChange={(date) => setDateRange({ ...dateRange, end: date })}
              />
            </Grid>
          </Grid>

          <FormControl fullWidth>
            <InputLabel>Formato de Exportación</InputLabel>
            <Select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
              <MenuItem value="pdf">PDF</MenuItem>
              <MenuItem value="xlsx">Excel</MenuItem>
              <MenuItem value="csv">CSV</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="subtitle1">Incluir en el Reporte:</Typography>
          <FormGroup>
            <Grid container spacing={2}>
              {Object.entries(includeFields).map(([field, checked]) => (
                <Grid item xs={12} sm={6} key={field}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(e) => 
                          setIncludeFields({
                            ...includeFields,
                            [field]: e.target.checked
                          })
                        }
                      />
                    }
                    label={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                  />
                </Grid>
              ))}
            </Grid>
          </FormGroup>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={generateReport}>
          Generar Reporte
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PayrollReportGenerator;
