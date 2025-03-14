import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { Payroll } from './payroll.entity';
import { PayrollCalculatorService } from './payroll-calculator.service';
import * as xlsx from 'xlsx';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(Payroll)
    private payrollRepository: Repository<Payroll>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private payrollCalculator: PayrollCalculatorService,
  ) {}

  async generatePayroll(employeeId: number, period: { start: Date; end: Date }) {
    const employee = await this.employeeRepository.findOneBy({ id: employeeId });
    if (!employee) {
      throw new NotFoundException('Empleado no encontrado');
    }

    const grossSalary = this.payrollCalculator.calculateGrossSalary(employee, {});
    const deductions = {
      tax: this.payrollCalculator.calculateTax(grossSalary),
      pension: this.payrollCalculator.calculatePension(employee.baseSalary),
      socialSecurity: this.payrollCalculator.calculateSocialSecurity(employee.baseSalary),
      loans: employee.deductions?.loans || 0,
      otherDeductions: 0
    };

    const netSalary = this.payrollCalculator.calculateNetSalary(grossSalary, deductions);

    const payroll = this.payrollRepository.create({
      employee,
      employeeId,
      paymentPeriodStart: period.start,
      paymentPeriodEnd: period.end,
      baseSalary: employee.baseSalary,
      benefits: {
        ...employee.benefits,
        overtimePay: this.payrollCalculator.calculateOvertimePay(employee),
        otherBenefits: 0
      },
      deductions,
      grossSalary,
      netSalary,
      status: 'pending'
    });

    return this.payrollRepository.save(payroll);
  }

  async findAll(): Promise<Employee[]> {
    try {
      const employees = await this.employeeRepository.find({
        order: {
          fullName: 'ASC'
        }
      });
      return employees;
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<Employee> {
    try {
      if (!id || isNaN(id)) {
        throw new NotFoundException('ID de empleado inválido');
      }

      const employee = await this.employeeRepository.findOne({
        where: { id }
      });

      if (!employee) {
        throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
      }

      return employee;
    } catch (error) {
      console.error('Error in findOne:', error);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    await this.employeeRepository.delete(id);
  }

  async create(employee: Employee): Promise<Employee> {
    return this.employeeRepository.save(employee);
  }

  async update(id: number, employee: Employee): Promise<void> {
    await this.employeeRepository.update(id, employee);
  }
}
