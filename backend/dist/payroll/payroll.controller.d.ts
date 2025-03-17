import { PayrollService } from './payroll.service';
import { GeneratePayrollDto } from './dtos/generate-payroll.dto';
import { Employee } from './employee.entity';
import { PayrollStatus } from './types';
export declare class PayrollController {
    private readonly payrollService;
    constructor(payrollService: PayrollService);
    generatePayroll(generatePayrollDto: GeneratePayrollDto): Promise<{
        success: boolean;
        data: import("./payroll.entity").Payroll;
        message: string;
    }>;
    findAll(): Promise<{
        success: boolean;
        data: import("./payroll.entity").Payroll[];
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    findAllEmployees(): Promise<{
        success: boolean;
        data: Employee[];
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        data: Employee;
        message: string;
    }>;
    remove(id: string): Promise<void>;
    create(employee: Employee): Promise<Employee>;
    update(id: string, employee: Employee): Promise<void>;
    updateStatus(id: string, status: PayrollStatus): Promise<{
        success: boolean;
        data: import("./payroll.entity").Payroll;
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
}
