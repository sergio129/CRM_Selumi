import { Employee } from '../payroll/employee.entity';
export declare class Attendance {
    id: number;
    employee: Employee;
    employeeId: number;
    checkIn: Date;
    checkOut: Date;
    status: string;
    biometricData: any;
}
