import { AttendanceService } from './attendance.service';
import { Attendance } from './attendance.entity';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    findAll(): Promise<Attendance[]>;
    findOne(id: string): Promise<Attendance>;
    remove(id: string): Promise<void>;
    create(attendance: Attendance): Promise<Attendance>;
    update(id: string, attendance: Attendance): Promise<void>;
}
