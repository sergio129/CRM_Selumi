export declare class Employee {
    id: number;
    fullName: string;
    documentType: string;
    documentNumber: string;
    address: string;
    phone: string;
    email: string;
    birthDate: Date;
    gender: string;
    position: string;
    department: string;
    hireDate: Date;
    contractType: string;
    supervisor: string;
    baseSalary: number;
    benefits: {
        healthInsurance?: number;
        transportationAllowance?: number;
        mealAllowance?: number;
        performanceBonus?: number;
    };
    deductions: {
        tax?: number;
        pension?: number;
        socialSecurity?: number;
        loans?: number;
    };
    overtimeHours: number;
    overtimeRate: number;
    paymentHistory: string[];
    paymentFrequency: string;
    bankName: string;
    bankAccountNumber: string;
    bankAccountType: string;
    lastPaymentDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
