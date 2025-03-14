import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  findAll(): Promise<Attendance[]> {
    return this.attendanceRepository.find();
  }

  findOne(id: number): Promise<Attendance> {
    return this.attendanceRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.attendanceRepository.delete(id);
  }

  async create(attendance: Attendance): Promise<Attendance> {
    return this.attendanceRepository.save(attendance);
  }

  async update(id: number, attendance: Attendance): Promise<void> {
    await this.attendanceRepository.update(id, attendance);
  }
}
