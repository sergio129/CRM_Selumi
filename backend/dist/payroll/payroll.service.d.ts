import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { Payroll } from './payroll.entity';
import { PayrollCalculatorService } from './payroll-calculator.service';
import { PayrollStatus } from './types';
import { GeneratePayrollDto } from './dtos/generate-payroll.dto';
export declare class PayrollService {
    private payrollRepository;
    private employeeRepository;
    private payrollCalculator;
    constructor(payrollRepository: Repository<Payroll>, employeeRepository: Repository<Employee>, payrollCalculator: PayrollCalculatorService);
    generatePayroll(generatePayrollDto: GeneratePayrollDto): Promise<Payroll>;
    findAll(): Promise<Payroll[]>;
    findOne(id: number): Promise<Employee>;
    remove(id: number): Promise<void>;
    create(employee: Employee): Promise<Employee>;
    update(id: number, employee: Employee): Promise<void>;
    findAllPayrolls(): Promise<{
        baseSalary: number;
        grossSalary: number;
        netSalary: number;
        benefits: any;
        deductions: any;
        id: number;
        employee: Employee;
        employeeId: number;
        paymentPeriodStart: Date;
        paymentPeriodEnd: Date;
        notes: string;
        status: "pendiente" | "aprobado" | "pagado" | "cancelado";
        createdAt: Date;
        paidAt: Date;
        attendanceDetails: {
            daysWorked: number;
            absences: number;
            holidays: number;
            vacationDays: number;
            sickDays: number;
        };
        overtimeDetails: {
            regularOvertimeHours: number;
            holidayOvertimeHours: number;
            nightOvertimeHours: number;
            totalOvertimeAmount: number;
        };
        incentives: {
            performance: number;
            attendance: number;
            leadership: number;
            other: number;
        };
        taxDetails: {
            taxableIncome: number;
            taxRate: number;
            taxExemptions: number;
            finalTax: number;
        };
        approvedBy: string;
        approvedAt: Date;
        isPaid: boolean;
        paymentReference: string;
        paymentMethod: string;
        adjustments: {
            description: string;
            amount: number;
            type: "addition" | "deduction";
            date: Date;
            approvedBy: string;
        }[];
    }[]>;
    updateStatus(id: number, status: PayrollStatus): Promise<Payroll>;
    findAllEmployees(): Promise<Employee[]>;
}
