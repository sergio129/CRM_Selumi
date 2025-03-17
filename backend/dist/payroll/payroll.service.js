"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_entity_1 = require("./employee.entity");
const payroll_entity_1 = require("./payroll.entity");
const payroll_calculator_service_1 = require("./payroll-calculator.service");
let PayrollService = class PayrollService {
    constructor(payrollRepository, employeeRepository, payrollCalculator) {
        this.payrollRepository = payrollRepository;
        this.employeeRepository = employeeRepository;
        this.payrollCalculator = payrollCalculator;
    }
    async generatePayroll(generatePayrollDto) {
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
                status: 'pendiente',
                benefits: {},
                deductions: {},
                grossSalary: 0,
                netSalary: 0
            };
            const newPayroll = this.payrollRepository.create(payrollData);
            return await this.payrollRepository.save(newPayroll);
        }
        catch (error) {
            throw new Error(`Error al generar nómina: ${error.message}`);
        }
    }
    async findAll() {
        try {
            return await this.payrollRepository.find({
                relations: ['employee']
            });
        }
        catch (error) {
            throw new Error('Error al obtener nóminas');
        }
    }
    async findOne(id) {
        try {
            if (!id || isNaN(id)) {
                throw new common_1.NotFoundException('ID de empleado inválido');
            }
            const employee = await this.employeeRepository.findOne({
                where: { id }
            });
            if (!employee) {
                throw new common_1.NotFoundException(`Empleado con ID ${id} no encontrado`);
            }
            return employee;
        }
        catch (error) {
            console.error('Error in findOne:', error);
            throw error;
        }
    }
    async remove(id) {
        await this.employeeRepository.delete(id);
    }
    async create(employee) {
        return this.employeeRepository.save(employee);
    }
    async update(id, employee) {
        await this.employeeRepository.update(id, employee);
    }
    async findAllPayrolls() {
        try {
            console.log('Buscando todas las nóminas...');
            const payrolls = await this.payrollRepository.find({
                relations: ['employee'],
                order: {
                    createdAt: 'DESC'
                }
            });
            const formattedPayrolls = payrolls.map(payroll => (Object.assign(Object.assign({}, payroll), { baseSalary: Number(payroll.baseSalary), grossSalary: Number(payroll.grossSalary), netSalary: Number(payroll.netSalary), benefits: typeof payroll.benefits === 'string' ?
                    JSON.parse(payroll.benefits) : payroll.benefits, deductions: typeof payroll.deductions === 'string' ?
                    JSON.parse(payroll.deductions) : payroll.deductions })));
            console.log(`Encontradas ${formattedPayrolls.length} nóminas`);
            return formattedPayrolls;
        }
        catch (error) {
            console.error('Error en findAllPayrolls:', error);
            throw error;
        }
    }
    async updateStatus(id, status) {
        try {
            const payroll = await this.payrollRepository.findOne({
                where: { id }
            });
            if (!payroll) {
                throw new Error('Nómina no encontrada');
            }
            payroll.status = status;
            return await this.payrollRepository.save(payroll);
        }
        catch (error) {
            throw new Error(`Error al actualizar estado: ${error.message}`);
        }
    }
    async findAllEmployees() {
        try {
            return await this.employeeRepository.find({
                order: {
                    fullName: 'ASC'
                }
            });
        }
        catch (error) {
            console.error('Error en findAllEmployees:', error);
            throw error;
        }
    }
};
exports.PayrollService = PayrollService;
exports.PayrollService = PayrollService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payroll_entity_1.Payroll)),
    __param(1, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        payroll_calculator_service_1.PayrollCalculatorService])
], PayrollService);
//# sourceMappingURL=payroll.service.js.map