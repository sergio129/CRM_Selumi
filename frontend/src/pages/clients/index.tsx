import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';

const Clients = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    axios.get('/api/clients')
      .then(response => setClients(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Clients
      </Typography>
      <List>
        {clients.map(client => (
          <ListItem key={client.id}>
            <ListItemText primary={client.fullName} secondary={client.email} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Clients;
