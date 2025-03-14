import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';

const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  useEffect(() => {
    axios.get('/api/attendance')
      .then(response => setAttendanceRecords(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Attendance Records
      </Typography>
      <List>
        {attendanceRecords.map(record => (
          <ListItem key={record.id}>
            <ListItemText primary={`Employee ID: ${record.employeeId}`} secondary={`Check-in: ${record.checkInTime}, Check-out: ${record.checkOutTime}, Status: ${record.status}`} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Attendance;
