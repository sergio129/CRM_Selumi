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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const xlsx = require("xlsx");
const bcrypt = require("bcrypt");
const user_entity_1 = require("./user.entity");
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async findAll() {
        try {
            const users = await this.usersRepository.find({
                select: [
                    'id',
                    'name',
                    'email',
                    'documentNumber',
                    'role',
                    'isActive',
                    'phoneNumber',
                    'profilePicture'
                ]
            });
            console.log('Users from database:', users);
            return users;
        }
        catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }
    findOne(id) {
        return this.usersRepository.findOneBy({ id });
    }
    async findByEmail(email) {
        try {
            console.log('Buscando usuario por email:', email);
            const user = await this.usersRepository.findOne({
                where: { email },
                select: ['id', 'email', 'password', 'name', 'role']
            });
            console.log('Usuario encontrado:', user ? 'Sí' : 'No');
            return user;
        }
        catch (error) {
            console.error('Error en findByEmail:', error);
            throw error;
        }
    }
    async findById(id) {
        try {
            console.log('Buscando usuario por ID:', id);
            return await this.usersRepository.findOne({
                where: { id },
                select: ['id', 'email', 'name', 'role']
            });
        }
        catch (error) {
            console.error('Error en findById:', error);
            throw error;
        }
    }
    async findByDocumentNumber(documentNumber) {
        try {
            console.log('Finding user by document number:', documentNumber);
            const user = await this.usersRepository.findOne({
                where: { documentNumber }
            });
            console.log('User found:', user ? Object.assign(Object.assign({}, user), { password: '****' }) : null);
            return user;
        }
        catch (error) {
            console.error('Error finding user:', error);
            throw error;
        }
    }
    async remove(id) {
        await this.usersRepository.delete(id);
    }
    async create(user) {
        try {
            const existingUser = await this.usersRepository.findOne({
                where: [
                    { email: user.email },
                    { documentNumber: user.documentNumber }
                ]
            });
            if (existingUser) {
                throw new common_1.HttpException('Ya existe un usuario con este email o número de documento', common_1.HttpStatus.CONFLICT);
            }
            if (user.password) {
                user.password = await bcrypt.hash(user.password, 10);
            }
            const newUser = await this.usersRepository.save(user);
            const { password } = newUser, result = __rest(newUser, ["password"]);
            return result;
        }
        catch (error) {
            throw new common_1.HttpException(`Error al crear usuario: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async assignRole(documentNumber, role) {
        const user = await this.usersRepository.findOneBy({ documentNumber });
        if (user) {
            user.role = role;
            await this.usersRepository.save(user);
        }
    }
    async incrementLoginAttempts(userId) {
        const user = await this.findOne(userId);
        user.loginAttempts += 1;
        if (user.loginAttempts >= 5) {
            user.blockedUntil = new Date(Date.now() + 10 * 60 * 1000);
        }
        await this.usersRepository.save(user);
    }
    async resetLoginAttempts(userId) {
        await this.usersRepository.update(userId, {
            loginAttempts: 0,
            blockedUntil: null,
        });
    }
    async enableMfa(userId) {
        const user = await this.findOne(userId);
        user.isMfaEnabled = true;
        return this.usersRepository.save(user);
    }
    async verifyMfa(userId, token) {
    }
    async enableBiometric(userId) {
        const user = await this.findOne(userId);
        user.isBiometricEnabled = true;
        return this.usersRepository.save(user);
    }
    async updateProfile(userId, data) {
        return this.usersRepository.update(userId, data);
    }
    async updateStatus(id, isActive) {
        const user = await this.findOne(id);
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        user.isActive = isActive;
        return this.usersRepository.save(user);
    }
    async search(term) {
        return this.usersRepository.find({
            where: [
                { name: (0, typeorm_2.Like)(`%${term}%`) },
                { email: (0, typeorm_2.Like)(`%${term}%`) },
                { documentNumber: (0, typeorm_2.Like)(`%${term}%`) }
            ]
        });
    }
    async resetPassword(id) {
        const user = await this.findOne(id);
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        const temporaryPassword = Math.random().toString(36).slice(-8);
        user.password = await bcrypt.hash(temporaryPassword, 10);
        await this.usersRepository.save(user);
    }
    async exportToExcel() {
        try {
            const users = await this.usersRepository.find({
                select: [
                    'name',
                    'email',
                    'documentNumber',
                    'role',
                    'isActive',
                    'phoneNumber',
                    'address',
                    'position',
                    'department'
                ]
            });
            const worksheet = xlsx.utils.json_to_sheet(users.map(user => ({
                'Nombre': user.name || '',
                'Email': user.email || '',
                'Documento': user.documentNumber || '',
                'Teléfono': user.phoneNumber || '',
                'Rol': user.role || '',
                'Estado': user.isActive ? 'Activo' : 'Inactivo',
                'Dirección': user.address || '',
                'Cargo': user.position || '',
                'Departamento': user.department || ''
            })));
            const workbook = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(workbook, worksheet, 'Usuarios');
            return xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        }
        catch (error) {
            throw new Error(`Error al exportar usuarios: ${error.message}`);
        }
    }
    async update(id, userData) {
        try {
            const user = await this.findOne(id);
            if (!user) {
                throw new common_1.NotFoundException('Usuario no encontrado');
            }
            const allowedFields = [
                'name',
                'email',
                'documentNumber',
                'phoneNumber',
                'role',
                'address',
                'birthDate',
                'position',
                'department',
                'emergencyContact',
                'emergencyPhone',
            ];
            const cleanedData = Object.keys(userData)
                .filter(key => allowedFields.includes(key))
                .reduce((obj, key) => {
                obj[key] = userData[key];
                return obj;
            }, {});
            Object.assign(user, cleanedData);
            const updatedUser = await this.usersRepository.save(user);
            const { password } = updatedUser, result = __rest(updatedUser, ["password"]);
            return result;
        }
        catch (error) {
            throw new common_1.HttpException(`Error al actualizar usuario: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateLastLogin(userId) {
        await this.usersRepository.update(userId, {
            lastLogin: new Date(),
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map