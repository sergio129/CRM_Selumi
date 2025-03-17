import { Controller, Post, Get, Body, Param, Query, UseGuards, Delete, Put, HttpException, HttpStatus, ParseIntPipe, Patch } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PayrollService } from './payroll.service';
import { GeneratePayrollDto } from './dtos/generate-payroll.dto';
import { Employee } from './employee.entity';
import { PayrollStatus } from './types';

interface UpdateStatusDto {
  status: PayrollStatus;
}

@Controller('payroll')
@UseGuards(JwtAuthGuard)
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post('generate')
  async generatePayroll(@Body() generatePayrollDto: GeneratePayrollDto) {
    try {
      console.log('Recibiendo datos para generar nómina:', generatePayrollDto); // Debug log
      
      const result = await this.payrollService.generatePayroll(generatePayrollDto);

      return {
        success: true,
        data: result,
        message: 'Nómina generada exitosamente'
      };
    } catch (error) {
      console.error('Error al generar nómina:', error); // Debug log
      throw new HttpException({
        success: false,
        message: error.message || 'Error al generar nómina',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll() {
    try {
      const payrolls = await this.payrollService.findAll();
      return {
        success: true,
        data: payrolls
      };
    } catch (error) {
      console.error('Error en findAll:', error);
      return {
        success: false,
        message: 'Error al obtener nóminas',
        error: error.message
      };
    }
  }

  @Get('employees')
  async findAllEmployees() {
    try {
      const employees = await this.payrollService.findAllEmployees();
      return {
        success: true,
        data: employees
      };
    } catch (error) {
      console.error('Error en findAllEmployees:', error);
      return {
        success: false,
        message: 'Error al obtener empleados',
        error: error.message
      };
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

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string, 
    @Body('status') status: PayrollStatus
  ) {
    try {
      const result = await this.payrollService.updateStatus(parseInt(id), status);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Error en updateStatus:', error);
      return {
        success: false,
        message: 'Error al actualizar estado',
        error: error.message
      };
    }
  }
}
