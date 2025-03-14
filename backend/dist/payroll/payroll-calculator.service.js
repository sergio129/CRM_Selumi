"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollCalculatorService = void 0;
const common_1 = require("@nestjs/common");
let PayrollCalculatorService = class PayrollCalculatorService {
    calculateGrossSalary(employee, payroll) {
        const baseSalary = employee.baseSalary || 0;
        const overtimePay = this.calculateOvertimePay(employee);
        const benefits = this.calculateTotalBenefits(employee);
        return baseSalary + overtimePay + benefits;
    }
    calculateNetSalary(grossSalary, deductions) {
        const totalDeductions = this.calculateTotalDeductions(deductions);
        return grossSalary - totalDeductions;
    }
    calculateOvertimePay(employee) {
        const { overtimeHours = 0, overtimeRate = 0 } = employee;
        return overtimeHours * overtimeRate;
    }
    calculateTotalBenefits(employee) {
        const benefits = employee.benefits || {};
        return Object.values(benefits).reduce((sum, value) => sum + (value || 0), 0);
    }
    calculateTotalDeductions(deductions) {
        return Object.values(deductions).reduce((sum, value) => sum + (value || 0), 0);
    }
    calculateTax(grossSalary) {
        let taxRate = 0;
        if (grossSalary <= 1000000)
            taxRate = 0;
        else if (grossSalary <= 2000000)
            taxRate = 0.19;
        else if (grossSalary <= 4000000)
            taxRate = 0.28;
        else
            taxRate = 0.37;
        return grossSalary * taxRate;
    }
    calculateSocialSecurity(baseSalary) {
        return baseSalary * 0.04;
    }
    calculatePension(baseSalary) {
        return baseSalary * 0.04;
    }
    calculatePayrollSummary(employees) {
        return {
            totalGrossSalary: employees.reduce((sum, emp) => sum + this.calculateGrossSalary(emp, {}), 0),
            totalEmployees: employees.length,
            averageSalary: employees.reduce((sum, emp) => sum + emp.baseSalary, 0) / employees.length,
            totalBenefits: employees.reduce((sum, emp) => sum + this.calculateTotalBenefits(emp), 0),
            departmentSummary: this.calculateDepartmentSummary(employees)
        };
    }
    calculateDepartmentSummary(employees) {
        const summary = {};
        employees.forEach(emp => {
            if (!summary[emp.department]) {
                summary[emp.department] = {
                    count: 0,
                    totalSalary: 0,
                    averageSalary: 0
                };
            }
            summary[emp.department].count++;
            summary[emp.department].totalSalary += emp.baseSalary;
        });
        Object.keys(summary).forEach(dept => {
            summary[dept].averageSalary = summary[dept].totalSalary / summary[dept].count;
        });
        return summary;
    }
};
exports.PayrollCalculatorService = PayrollCalculatorService;
exports.PayrollCalculatorService = PayrollCalculatorService = __decorate([
    (0, common_1.Injectable)()
], PayrollCalculatorService);
//# sourceMappingURL=payroll-calculator.service.js.map