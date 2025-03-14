import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { Payroll } from './payroll.entity';
import { PayrollCalculatorService } from './payroll-calculator.service';
export declare class PayrollService {
    private payrollRepository;
    private employeeRepository;
    private payrollCalculator;
    constructor(payrollRepository: Repository<Payroll>, employeeRepository: Repository<Employee>, payrollCalculator: PayrollCalculatorService);
    generatePayroll(employeeId: number, period: {
        start: Date;
        end: Date;
    }): Promise<Payroll>;
    findAll(): Promise<Employee[]>;
    findOne(id: number): Promise<Employee>;
    remove(id: number): Promise<void>;
    create(employee: Employee): Promise<Employee>;
    update(id: number, employee: Employee): Promise<void>;
}
