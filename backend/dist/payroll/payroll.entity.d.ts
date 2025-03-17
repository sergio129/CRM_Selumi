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
    status: 'pendiente' | 'aprobado' | 'pagado' | 'cancelado';
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
        type: 'addition' | 'deduction';
        date: Date;
        approvedBy: string;
    }[];
}
