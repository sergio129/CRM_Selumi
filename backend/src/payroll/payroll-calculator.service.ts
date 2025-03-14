import { Injectable } from '@nestjs/common';
import { Employee } from './employee.entity';
import { Payroll } from './payroll.entity';

interface Deductions {
  tax?: number;
  pension?: number;
  socialSecurity?: number;
  loans?: number;
  otherDeductions?: number;
}

@Injectable()
export class PayrollCalculatorService {
  calculateGrossSalary(employee: Employee, payroll: Partial<Payroll>): number {
    const baseSalary = employee.baseSalary || 0;
    const overtimePay = this.calculateOvertimePay(employee);
    const benefits = this.calculateTotalBenefits(employee);

    return baseSalary + overtimePay + benefits;
  }

  calculateNetSalary(grossSalary: number, deductions: Deductions): number {
    const totalDeductions = this.calculateTotalDeductions(deductions);
    return grossSalary - totalDeductions;
  }

  public calculateOvertimePay(employee: Employee): number {
    const { overtimeHours = 0, overtimeRate = 0 } = employee;
    return overtimeHours * overtimeRate;
  }

  private calculateTotalBenefits(employee: Employee): number {
    const benefits = employee.benefits || {};
    return Object.values(benefits).reduce((sum, value) => sum + (value || 0), 0);
  }

  private calculateTotalDeductions(deductions: Deductions): number {
    return Object.values(deductions).reduce((sum: number, value: number | undefined) => sum + (value || 0), 0);
  }

  calculateTax(grossSalary: number): number {
    // Implementar cálculo de impuestos según normativa local
    let taxRate = 0;
    if (grossSalary <= 1000000) taxRate = 0;
    else if (grossSalary <= 2000000) taxRate = 0.19;
    else if (grossSalary <= 4000000) taxRate = 0.28;
    else taxRate = 0.37;

    return grossSalary * taxRate;
  }

  calculateSocialSecurity(baseSalary: number): number {
    // Implementar cálculo de seguridad social
    return baseSalary * 0.04; // 4% del salario base
  }

  calculatePension(baseSalary: number): number {
    // Implementar cálculo de pensión
    return baseSalary * 0.04; // 4% del salario base
  }

  calculatePayrollSummary(employees: Employee[]): any {
    return {
      totalGrossSalary: employees.reduce((sum, emp) => sum + this.calculateGrossSalary(emp, {}), 0),
      totalEmployees: employees.length,
      averageSalary: employees.reduce((sum, emp) => sum + emp.baseSalary, 0) / employees.length,
      totalBenefits: employees.reduce((sum, emp) => sum + this.calculateTotalBenefits(emp), 0),
      departmentSummary: this.calculateDepartmentSummary(employees)
    };
  }

  private calculateDepartmentSummary(employees: Employee[]): any {
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

    // Calcular promedios
    Object.keys(summary).forEach(dept => {
      summary[dept].averageSalary = summary[dept].totalSalary / summary[dept].count;
    });

    return summary;
  }
}
