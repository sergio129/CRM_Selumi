import { NextApiRequest, NextApiResponse } from 'next';
import { getRepository } from 'typeorm';
import { Client } from '../../../../backend/src/clients/client.entity';
import { createConnection } from '../../../../backend/src/database';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await createConnection();
  const clientsRepository = getRepository(Client);

  if (req.method === 'GET') {
    const clients = await clientsRepository.find();
    res.status(200).json(clients);
  } else if (req.method === 'POST') {
    const client = await clientsRepository.save(req.body);
    res.status(201).json(client);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
