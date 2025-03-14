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
exports.BiometricController = void 0;
const common_1 = require("@nestjs/common");
const biometric_service_1 = require("./biometric.service");
let BiometricController = class BiometricController {
    constructor(biometricService) {
        this.biometricService = biometricService;
    }
    capture(data) {
    }
    verify(data) {
    }
    integrate(data) {
        const { deviceId, biometricData } = data;
        return this.biometricService.integrateWithAccessControl(deviceId, biometricData);
    }
};
exports.BiometricController = BiometricController;
__decorate([
    (0, common_1.Post)('capture'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BiometricController.prototype, "capture", null);
__decorate([
    (0, common_1.Post)('verify'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BiometricController.prototype, "verify", null);
__decorate([
    (0, common_1.Post)('integrate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BiometricController.prototype, "integrate", null);
exports.BiometricController = BiometricController = __decorate([
    (0, common_1.Controller)('biometric'),
    __metadata("design:paramtypes", [biometric_service_1.BiometricService])
], BiometricController);
//# sourceMappingURL=biometric.controller.js.map