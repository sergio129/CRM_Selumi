"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/user.entity");
const client_entity_1 = require("../clients/client.entity");
const transaction_entity_1 = require("../accounting/transaction.entity");
const loan_entity_1 = require("../loans/loan.entity");
const employee_entity_1 = require("../payroll/employee.entity");
const role_entity_1 = require("../roles/role.entity");
const attendance_entity_1 = require("../attendance/attendance.entity");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: 'localhost',
                port: 3306,
                username: 'root',
                password: 'Sheyo_0129',
                database: 'crm',
                entities: [user_entity_1.User, client_entity_1.Client, transaction_entity_1.Transaction, loan_entity_1.Loan, employee_entity_1.Employee, role_entity_1.Role, attendance_entity_1.Attendance],
                synchronize: true,
                logging: true,
            }),
        ],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map