import { Employee } from './employee.entity';
import { Payroll } from './payroll.entity';
interface Deductions {
    tax?: number;
    pension?: number;
    socialSecurity?: number;
    loans?: number;
    otherDeductions?: number;
}
export declare class PayrollCalculatorService {
    calculateGrossSalary(employee: Employee, payroll: Partial<Payroll>): number;
    calculateNetSalary(grossSalary: number, deductions: Deductions): number;
    calculateOvertimePay(employee: Employee): number;
    private calculateTotalBenefits;
    private calculateTotalDeductions;
    calculateTax(grossSalary: number): number;
    calculateSocialSecurity(baseSalary: number): number;
    calculatePension(baseSalary: number): number;
    calculatePayrollSummary(employees: Employee[]): any;
    private calculateDepartmentSummary;
}
export {};
