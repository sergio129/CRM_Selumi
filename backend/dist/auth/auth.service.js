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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const mfa_service_1 = require("./mfa.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(usersService, jwtService, mfaService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.mfaService = mfaService;
    }
    async validateUser(documentNumber, pass) {
        const user = await this.usersService.findByDocumentNumber(documentNumber);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password } = user, result = __rest(user, ["password"]);
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = { documentNumber: user.documentNumber, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async register(user) {
        const existingUser = await this.usersService.findByEmail(user.email);
        if (existingUser) {
            throw new common_1.HttpException('Email already exists', common_1.HttpStatus.BAD_REQUEST);
        }
        user.password = await bcrypt.hash(user.password, 10);
        const newUser = await this.usersService.create(user);
        await this.usersService.assignRole(user.documentNumber, 'user');
        return newUser;
    }
    async validateLogin(documentNumber, password) {
        try {
            console.log('Validating login for:', documentNumber);
            const cleanDocumentNumber = documentNumber.replace(/\./g, '');
            const user = await this.usersService.findByDocumentNumber(cleanDocumentNumber);
            if (!user) {
                throw new common_1.HttpException('Usuario no encontrado', common_1.HttpStatus.UNAUTHORIZED);
            }
            console.log('User found:', Object.assign(Object.assign({}, user), { password: '****' }));
            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log('Password valid:', isPasswordValid);
            if (!isPasswordValid) {
                await this.usersService.incrementLoginAttempts(user.id);
                throw new common_1.HttpException('Credenciales inválidas', common_1.HttpStatus.UNAUTHORIZED);
            }
            const result = {
                access_token: this.jwtService.sign({
                    sub: user.id,
                    documentNumber: user.documentNumber,
                    role: user.role
                }),
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    documentNumber: user.documentNumber,
                    role: user.role
                }
            };
            console.log('Login successful, returning:', Object.assign(Object.assign({}, result), { access_token: '****' }));
            return result;
        }
        catch (error) {
            console.error('ValidateLogin error:', error);
            throw error;
        }
    }
    async validateMfaToken(userId, token) {
        const user = await this.usersService.findOne(userId);
        if (!user.mfaSecret) {
            throw new common_1.HttpException('MFA no configurado', common_1.HttpStatus.BAD_REQUEST);
        }
        const isValid = this.mfaService.verifyToken(user.mfaSecret, token);
        if (!isValid) {
            throw new common_1.HttpException('Código MFA inválido', common_1.HttpStatus.UNAUTHORIZED);
        }
        return this.generateTokens(user);
    }
    generateTokens(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            documentNumber: user.documentNumber
        };
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' })
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        mfa_service_1.MfaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map