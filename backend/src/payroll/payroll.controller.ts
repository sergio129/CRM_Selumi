import { Controller, Post, Get, Body, Param, Query, UseGuards, Delete, Put, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PayrollService } from './payroll.service';
import { GeneratePayrollDto } from './dtos/generate-payroll.dto';
import { Employee } from './employee.entity';

@Controller('payroll')
@UseGuards(JwtAuthGuard)
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post('generate')
  async generatePayroll(@Body() generatePayrollDto: GeneratePayrollDto) {
    return this.payrollService.generatePayroll(
      generatePayrollDto.employeeId,
      {
        start: new Date(generatePayrollDto.periodStart),
        end: new Date(generatePayrollDto.periodEnd)
      }
    );
  }

  @Get()
  async findAll() {
    try {
      const employees = await this.payrollService.findAll();
      return {
        success: true,
        data: employees,
        message: 'Empleados recuperados exitosamente'
      };
    } catch (error) {
      throw new HttpException({
        success: false,
        message: 'Error al recuperar empleados',
        error: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('employees')
  async findAllEmployees() {
    try {
      const employees = await this.payrollService.findAll();
      return {
        success: true,
        data: employees || [],
        message: 'Empleados recuperados exitosamente'
      };
    } catch (error) {
      console.error('Error in findAllEmployees:', error);
      throw new HttpException({
        success: false,
        message: 'Error al recuperar empleados',
        error: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const employee = await this.payrollService.findOne(id);
      return {
        success: true,
        data: employee,
        message: 'Empleado encontrado exitosamente'
      };
    } catch (error) {
      throw new HttpException({
        success: false,
        message: error.message || 'Error al obtener empleado',
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.payrollService.remove(+id);
  }

  @Post()
  create(@Body() employee: Employee): Promise<Employee> {
    return this.payrollService.create(employee);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() employee: Employee): Promise<void> {
    return this.payrollService.update(+id, employee);
  }
}
