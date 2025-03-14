import { Repository } from 'typeorm';
import { Attendance } from './attendance.entity';
export declare class AttendanceService {
    private attendanceRepository;
    constructor(attendanceRepository: Repository<Attendance>);
    findAll(): Promise<Attendance[]>;
    findOne(id: number): Promise<Attendance>;
    remove(id: number): Promise<void>;
    create(attendance: Attendance): Promise<Attendance>;
    update(id: number, attendance: Attendance): Promise<void>;
}
