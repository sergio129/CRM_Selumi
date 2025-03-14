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
exports.AccessControlController = void 0;
const common_1 = require("@nestjs/common");
const access_control_service_1 = require("./access-control.service");
let AccessControlController = class AccessControlController {
    constructor(accessControlService) {
        this.accessControlService = accessControlService;
    }
    grantAccess(data) {
    }
    revokeAccess(data) {
    }
};
exports.AccessControlController = AccessControlController;
__decorate([
    (0, common_1.Post)('grant'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AccessControlController.prototype, "grantAccess", null);
__decorate([
    (0, common_1.Post)('revoke'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AccessControlController.prototype, "revokeAccess", null);
exports.AccessControlController = AccessControlController = __decorate([
    (0, common_1.Controller)('access-control'),
    __metadata("design:paramtypes", [access_control_service_1.AccessControlService])
], AccessControlController);
//# sourceMappingURL=access-control.controller.js.map