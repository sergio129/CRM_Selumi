import { PayrollService } from './payroll.service';
import { GeneratePayrollDto } from './dtos/generate-payroll.dto';
import { Employee } from './employee.entity';
export declare class PayrollController {
    private readonly payrollService;
    constructor(payrollService: PayrollService);
    generatePayroll(generatePayrollDto: GeneratePayrollDto): Promise<import("./payroll.entity").Payroll>;
    findAll(): Promise<{
        success: boolean;
        data: Employee[];
        message: string;
    }>;
    findAllEmployees(): Promise<{
        success: boolean;
        data: Employee[];
        message: string;
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        data: Employee;
        message: string;
    }>;
    remove(id: string): Promise<void>;
    create(employee: Employee): Promise<Employee>;
    update(id: string, employee: Employee): Promise<void>;
}
