"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("./database/database.module");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const clients_module_1 = require("./clients/clients.module");
const accounting_module_1 = require("./accounting/accounting.module");
const loans_module_1 = require("./loans/loans.module");
const payroll_module_1 = require("./payroll/payroll.module");
const roles_module_1 = require("./roles/roles.module");
const biometric_module_1 = require("./biometric/biometric.module");
const reports_module_1 = require("./reports/reports.module");
const notifications_module_1 = require("./notifications/notifications.module");
const attendance_module_1 = require("./attendance/attendance.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            database_module_1.DatabaseModule,
            users_module_1.UsersModule,
            clients_module_1.ClientsModule,
            accounting_module_1.AccountingModule,
            loans_module_1.LoansModule,
            payroll_module_1.PayrollModule,
            roles_module_1.RolesModule,
            biometric_module_1.BiometricModule,
            reports_module_1.ReportsModule,
            notifications_module_1.NotificationsModule,
            attendance_module_1.AttendanceModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map