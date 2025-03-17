import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
  DialogActions,
  Paper,
  Divider
} from '@mui/material';

const DEDUCCIONES_NOMBRES = {
  salud: 'Aportes a Salud (4%)',
  pension: 'Aportes a Pensión (4%)',
  fondoSolidaridad: 'Fondo de Solidaridad Pensional (1%)',
  retencionFuente: 'Retención en la Fuente (4-6%)',
  libranza: 'Libranza',
  embargos: 'Embargos Judiciales',
  otros: 'Otras Deducciones'
};

const PayrollDeductionsDialog = ({ open, onClose, payroll }) => {
  const formatMoneda = (monto) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(monto || 0);
  };

  const calcularTotal = (deducciones) => {
    if (!deducciones) return 0;
    return Object.values(deducciones).reduce((suma, valor) => suma + (Number(valor) || 0), 0);
  };

  const calcularPorcentaje = (valor, total) => {
    if (!valor || !total) return 0;
    return ((Number(valor) / total) * 100).toFixed(1);
  };

  const organizarDeducciones = (deducciones) => {
    if (!deducciones) return [];
    
    // Asegurar que las deducciones estén en el formato correcto
    const deduccionesFormateadas = {
      salud: deducciones.salud || 0,
      pension: deducciones.pension || 0,
      retencionFuente: deducciones.retencionFuente || 0,
      fondoSolidaridad: deducciones.fondoSolidaridad || 0,
      libranza: deducciones.libranza || 0,
      embargos: deducciones.embargos || 0,
      otros: deducciones.otros || 0
    };
    
    return Object.entries(deduccionesFormateadas)
      .filter(([_, valor]) => Number(valor) > 0)
      .sort((a, b) => Number(b[1]) - Number(a[1]));
  };

  const totalDeducciones = calcularTotal(payroll?.deductions);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Desglose de Deducciones
      </DialogTitle>
      <DialogContent>
        <Paper elevation={0} sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Empleado: {payroll?.employee?.fullName}
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            Período: {
              new Date(payroll?.paymentPeriodStart).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long'
              })
            }
          </Typography>
        </Paper>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Concepto</strong></TableCell>
              <TableCell align="right"><strong>Monto</strong></TableCell>
              <TableCell align="right"><strong>Porcentaje</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {organizarDeducciones(payroll?.deductions).map(([concepto, valor]) => (
              <TableRow key={concepto}>
                <TableCell>
                  {DEDUCCIONES_NOMBRES[concepto] || concepto}
                </TableCell>
                <TableCell align="right">
                  {formatMoneda(valor)}
                </TableCell>
                <TableCell align="right">
                  {`${calcularPorcentaje(valor, totalDeducciones)}%`}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell><strong>Total Deducciones</strong></TableCell>
              <TableCell align="right" colSpan={2}>
                <strong>{formatMoneda(totalDeducciones)}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Paper elevation={0} sx={{ p: 2, mt: 2, bgcolor: 'grey.100' }}>
          <Typography variant="body2">
            Salario Base: {formatMoneda(payroll?.baseSalary)}
          </Typography>
          <Typography variant="body2" color="error">
            Deducciones: -{formatMoneda(totalDeducciones)}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="h6" color="primary">
            Salario Neto: {formatMoneda(payroll?.netSalary)}
          </Typography>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PayrollDeductionsDialog;
