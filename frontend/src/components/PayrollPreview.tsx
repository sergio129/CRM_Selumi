import { Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableRow, Typography, Button } from '@mui/material';

const PayrollPreview = ({ open, onClose, payrollData }) => {
  if (!payrollData) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Vista Previa de Nómina</DialogTitle>
      <DialogContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell><Typography variant="subtitle2">Empleado:</Typography></TableCell>
              <TableCell>{payrollData.employee?.fullName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><Typography variant="subtitle2">Período:</Typography></TableCell>
              <TableCell>
                {new Date(payrollData.periodStart).toLocaleDateString()} - 
                {new Date(payrollData.periodEnd).toLocaleDateString()}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell><Typography variant="subtitle2">Salario Base:</Typography></TableCell>
              <TableCell>${payrollData.baseSalary?.toLocaleString()}</TableCell>
            </TableRow>
            {/* ...más detalles de nómina... */}
          </TableBody>
        </Table>
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          sx={{ mt: 2 }}
          onClick={onClose}
        >
          Confirmar y Generar
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PayrollPreview;
