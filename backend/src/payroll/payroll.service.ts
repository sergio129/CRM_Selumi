import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { Payroll } from './payroll.entity';
import { PayrollCalculatorService } from './payroll-calculator.service';
import * as xlsx from 'xlsx';
import { PayrollStatus } from './types';
import { GeneratePayrollDto } from './dtos/generate-payroll.dto';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(Payroll)
    private payrollRepository: Repository<Payroll>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private payrollCalculator: PayrollCalculatorService
  ) {}

  async generatePayroll(generatePayrollDto: GeneratePayrollDto): Promise<Payroll> {
    try {
      const employee = await this.employeeRepository.findOne({
        where: { id: generatePayrollDto.employeeId }
      });

      if (!employee) {
        throw new Error('Empleado no encontrado');
      }

      const payrollData = {
        employee,
        employeeId: employee.id,
        paymentPeriodStart: new Date(generatePayrollDto.periodStart),
        paymentPeriodEnd: new Date(generatePayrollDto.periodEnd),
        baseSalary: employee.baseSalary,
        status: 'pendiente' as PayrollStatus,
        // Inicializar otros campos requeridos
        benefits: {},
        deductions: {},
        grossSalary: 0,
        netSalary: 0
      };

      const newPayroll = this.payrollRepository.create(payrollData);
      return await this.payrollRepository.save(newPayroll);
    } catch (error) {
      throw new Error(`Error al generar nómina: ${error.message}`);
    }
  }

  async findAll(): Promise<Payroll[]> {
    try {
      return await this.payrollRepository.find({
        relations: ['employee']
      });
    } catch (error) {
      throw new Error('Error al obtener nóminas');
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

  async findAllPayrolls() {
    try {
      console.log('Buscando todas las nóminas...'); // Debug log
      const payrolls = await this.payrollRepository.find({
        relations: ['employee'],
        order: {
          createdAt: 'DESC'
        }
      });
      
      // Asegurar que los datos numéricos sean números
      const formattedPayrolls = payrolls.map(payroll => ({
        ...payroll,
        baseSalary: Number(payroll.baseSalary),
        grossSalary: Number(payroll.grossSalary),
        netSalary: Number(payroll.netSalary),
        benefits: typeof payroll.benefits === 'string' ? 
          JSON.parse(payroll.benefits) : payroll.benefits,
        deductions: typeof payroll.deductions === 'string' ? 
          JSON.parse(payroll.deductions) : payroll.deductions,
      }));

      console.log(`Encontradas ${formattedPayrolls.length} nóminas`); // Debug log
      return formattedPayrolls;
    } catch (error) {
      console.error('Error en findAllPayrolls:', error);
      throw error;
    }
  }

  async updateStatus(id: number, status: PayrollStatus): Promise<Payroll> {
    try {
      const payroll = await this.payrollRepository.findOne({
        where: { id }
      });

      if (!payroll) {
        throw new Error('Nómina no encontrada');
      }

      payroll.status = status;
      return await this.payrollRepository.save(payroll);
    } catch (error) {
      throw new Error(`Error al actualizar estado: ${error.message}`);
    }
  }

  async findAllEmployees(): Promise<Employee[]> {
    try {
      return await this.employeeRepository.find({
        order: {
          fullName: 'ASC'
        }
      });
    } catch (error) {
      console.error('Error en findAllEmployees:', error);
      throw error;
    }
  }
}
