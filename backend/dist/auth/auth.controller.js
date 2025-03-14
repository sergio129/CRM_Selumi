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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const user_entity_1 = require("../users/user.entity");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const jwt_1 = require("@nestjs/jwt");
let AuthController = class AuthController {
    constructor(authService, jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }
    async login(body) {
        try {
            console.log('Login attempt:', body.documentNumber);
            const result = await this.authService.validateLogin(body.documentNumber, body.password);
            console.log('Login result:', result);
            return result;
        }
        catch (error) {
            console.error('Login error:', error);
            throw new common_1.HttpException(error.message || 'Error en la autenticación', error.status || common_1.HttpStatus.UNAUTHORIZED);
        }
    }
    async register(user) {
        try {
            return await this.authService.register(user);
        }
        catch (error) {
            console.error('Error al registrar:', error.message);
            throw new common_1.HttpException(`Error al registrar: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async refreshToken(req) {
        try {
            const user = req.user;
            const access_token = this.jwtService.sign({
                sub: user.id,
                documentNumber: user.documentNumber,
                role: user.role
            });
            return {
                success: true,
                access_token,
                message: 'Token renovado exitosamente'
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: 'Error al renovar token',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService, jwt_1.JwtService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map