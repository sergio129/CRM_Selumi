"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankIntegrationService = void 0;
const common_1 = require("@nestjs/common");
let BankIntegrationService = class BankIntegrationService {
    async processPayrollTransfer(transferDetails) {
        try {
            console.log('Procesando transferencia bancaria:', Object.assign(Object.assign({}, transferDetails), { timestamp: new Date().toISOString() }));
            return true;
        }
        catch (error) {
            console.error('Error en transferencia bancaria:', error);
            return false;
        }
    }
    async validateBankAccount(bankName, accountNumber) {
        return true;
    }
    async getBanksList() {
        return [
            'Bancolombia',
            'Banco de Bogotá',
            'Davivienda',
            'BBVA Colombia',
            'Banco de Occidente',
            'Banco Popular',
            'Banco AV Villas',
            'Scotiabank Colpatria'
        ];
    }
    async getTransactionStatus(reference) {
        return 'completed';
    }
};
exports.BankIntegrationService = BankIntegrationService;
exports.BankIntegrationService = BankIntegrationService = __decorate([
    (0, common_1.Injectable)()
], BankIntegrationService);
//# sourceMappingURL=bank-integration.service.js.map