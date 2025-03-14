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
    async generatePayroll(employeeId, period) {
        var _a;
        const employee = await this.employeeRepository.findOneBy({ id: employeeId });
        if (!employee) {
            throw new common_1.NotFoundException('Empleado no encontrado');
        }
        const grossSalary = this.payrollCalculator.calculateGrossSalary(employee, {});
        const deductions = {
            tax: this.payrollCalculator.calculateTax(grossSalary),
            pension: this.payrollCalculator.calculatePension(employee.baseSalary),
            socialSecurity: this.payrollCalculator.calculateSocialSecurity(employee.baseSalary),
            loans: ((_a = employee.deductions) === null || _a === void 0 ? void 0 : _a.loans) || 0,
            otherDeductions: 0
        };
        const netSalary = this.payrollCalculator.calculateNetSalary(grossSalary, deductions);
        const payroll = this.payrollRepository.create({
            employee,
            employeeId,
            paymentPeriodStart: period.start,
            paymentPeriodEnd: period.end,
            baseSalary: employee.baseSalary,
            benefits: Object.assign(Object.assign({}, employee.benefits), { overtimePay: this.payrollCalculator.calculateOvertimePay(employee), otherBenefits: 0 }),
            deductions,
            grossSalary,
            netSalary,
            status: 'pending'
        });
        return this.payrollRepository.save(payroll);
    }
    async findAll() {
        try {
            const employees = await this.employeeRepository.find({
                order: {
                    fullName: 'ASC'
                }
            });
            return employees;
        }
        catch (error) {
            console.error('Error in findAll:', error);
            throw error;
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