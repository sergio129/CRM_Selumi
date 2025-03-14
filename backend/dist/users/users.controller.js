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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const users_service_1 = require("./users.service");
const user_entity_1 = require("./user.entity");
const express_1 = require("express");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async findAll() {
        try {
            const users = await this.usersService.findAll();
            return {
                success: true,
                data: users,
                message: 'Usuarios recuperados exitosamente'
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: 'Error al recuperar usuarios',
                error: error.message
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async exportToExcel(res) {
        try {
            const buffer = await this.usersService.exportToExcel();
            res.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename=usuarios.xlsx',
                'Content-Length': buffer.length
            });
            res.send(buffer);
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: 'Error al exportar usuarios',
                error: error.message
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async search(term) {
        return this.usersService.search(term);
    }
    async findOne(id) {
        try {
            const user = await this.usersService.findOne(+id);
            if (!user) {
                throw new common_1.HttpException({
                    success: false,
                    message: 'Usuario no encontrado'
                }, common_1.HttpStatus.NOT_FOUND);
            }
            return {
                success: true,
                data: user,
                message: 'Usuario encontrado'
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: 'Error al recuperar usuario',
                error: error.message
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    remove(id) {
        return this.usersService.remove(+id);
    }
    async enableMfa(body) {
        return this.usersService.enableMfa(body.userId);
    }
    async verifyMfa(body) {
        return this.usersService.verifyMfa(body.userId, body.token);
    }
    async enableBiometric(body) {
        return this.usersService.enableBiometric(body.userId);
    }
    async updateProfile(body) {
        return this.usersService.updateProfile(body.userId, body);
    }
    async updateStatus(id, isActive) {
        return this.usersService.updateStatus(+id, isActive);
    }
    async resetPassword(id) {
        return this.usersService.resetPassword(+id);
    }
    async create(user) {
        try {
            if (!user.name || !user.email || !user.documentNumber || !user.password) {
                throw new common_1.HttpException('Faltan campos requeridos: nombre, email, número de documento y contraseña son obligatorios', common_1.HttpStatus.BAD_REQUEST);
            }
            user.documentNumber = user.documentNumber.replace(/[.\s]/g, '');
            const newUser = await this.usersService.create(user);
            return {
                success: true,
                message: 'Usuario creado exitosamente',
                data: newUser
            };
        }
        catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new common_1.HttpException('El email o número de documento ya está registrado', common_1.HttpStatus.CONFLICT);
            }
            throw new common_1.HttpException(`Error al crear usuario: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, userData) {
        try {
            const updatedUser = await this.usersService.update(+id, userData);
            return {
                success: true,
                data: updatedUser,
                message: 'Usuario actualizado exitosamente'
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error.message || 'Error al actualizar usuario',
            }, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('export'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "exportToExcel", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('term')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('mfa/enable'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "enableMfa", null);
__decorate([
    (0, common_1.Post)('mfa/verify'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "verifyMfa", null);
__decorate([
    (0, common_1.Post)('biometric/enable'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "enableBiometric", null);
__decorate([
    (0, common_1.Put)('profile'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/reset-password'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map