import { NextApiRequest, NextApiResponse } from 'next';
import { getRepository } from 'typeorm';
import { Attendance } from '../../../../backend/src/attendance/attendance.entity';
import { createConnection } from '../../../../backend/src/database';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await createConnection();
  const attendanceRepository = getRepository(Attendance);

  if (req.method === 'GET') {
    const attendanceRecords = await attendanceRepository.find();
    res.status(200).json(attendanceRecords);
  } else if (req.method === 'POST') {
    const attendanceRecord = await attendanceRepository.save(req.body);
    res.status(201).json(attendanceRecord);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
