"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const client_entity_1 = require("../clients/client.entity");
const transaction_entity_1 = require("../accounting/transaction.entity");
const loan_entity_1 = require("../loans/loan.entity");
const employee_entity_1 = require("../payroll/employee.entity");
const role_entity_1 = require("../roles/role.entity");
const attendance_entity_1 = require("../attendance/attendance.entity");
const path_1 = require("path");
const dataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'Sheyo_0129',
    database: 'crm',
    entities: [user_entity_1.User, client_entity_1.Client, transaction_entity_1.Transaction, loan_entity_1.Loan, employee_entity_1.Employee, role_entity_1.Role, attendance_entity_1.Attendance],
    migrations: [(0, path_1.join)(__dirname, 'migrations', '*.{ts,js}')],
    synchronize: false,
    logging: true,
});
try {
    dataSource.initialize().then(() => {
        console.log("Base de datos conectada exitosamente!");
        const userRepo = dataSource.getRepository(user_entity_1.User);
        userRepo.find().then(users => {
            console.log(`Usuarios encontrados: ${users.length}`);
        });
    });
}
catch (err) {
    console.error("Error al conectar con la base de datos:", err);
}
exports.default = dataSource;
//# sourceMappingURL=data-source.js.map