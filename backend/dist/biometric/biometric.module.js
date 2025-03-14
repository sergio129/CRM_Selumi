"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiometricModule = void 0;
const common_1 = require("@nestjs/common");
const biometric_service_1 = require("./biometric.service");
const biometric_controller_1 = require("./biometric.controller");
const access_control_service_1 = require("./access-control.service");
const access_control_controller_1 = require("./access-control.controller");
let BiometricModule = class BiometricModule {
};
exports.BiometricModule = BiometricModule;
exports.BiometricModule = BiometricModule = __decorate([
    (0, common_1.Module)({
        providers: [biometric_service_1.BiometricService, access_control_service_1.AccessControlService],
        controllers: [biometric_controller_1.BiometricController, access_control_controller_1.AccessControlController],
    })
], BiometricModule);
//# sourceMappingURL=biometric.module.js.map