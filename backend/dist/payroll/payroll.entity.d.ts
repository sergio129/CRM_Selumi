import { Employee } from './employee.entity';
export declare class Payroll {
    id: number;
    employee: Employee;
    employeeId: number;
    paymentPeriodStart: Date;
    paymentPeriodEnd: Date;
    baseSalary: number;
    benefits: {
        healthInsurance: number;
        transportationAllowance: number;
        mealAllowance: number;
        performanceBonus: number;
        overtimePay: number;
        otherBenefits: number;
    };
    deductions: {
        tax: number;
        pension: number;
        socialSecurity: number;
        loans: number;
        otherDeductions: number;
    };
    grossSalary: number;
    netSalary: number;
    notes: string;
    status: string;
    createdAt: Date;
    paidAt: Date;
}
