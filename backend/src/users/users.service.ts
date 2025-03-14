import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as xlsx from 'xlsx';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
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
      console.log('Users from database:', users); // Para debug
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }

  async findByDocumentNumber(documentNumber: string): Promise<User> {
    try {
      console.log('Finding user by document number:', documentNumber); // Debug log
      const user = await this.usersRepository.findOne({
        where: { documentNumber }
      });
      console.log('User found:', user ? { ...user, password: '****' } : null); // Debug log
      return user;
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async create(user: User): Promise<User> {
    try {
      // Verificar si ya existe un usuario con el mismo email o documento
      const existingUser = await this.usersRepository.findOne({
        where: [
          { email: user.email },
          { documentNumber: user.documentNumber }
        ]
      });

      if (existingUser) {
        throw new HttpException(
          'Ya existe un usuario con este email o número de documento',
          HttpStatus.CONFLICT
        );
      }

      // Hashear la contraseña antes de guardar
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }

      const newUser = await this.usersRepository.save(user);
      
      // Eliminar la contraseña antes de devolver el usuario
      const { password, ...result } = newUser;
      return result as User;
    } catch (error) {
      throw new HttpException(
        `Error al crear usuario: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async assignRole(documentNumber: string, role: string): Promise<void> {
    const user = await this.usersRepository.findOneBy({ documentNumber });
    if (user) {
      user.role = role;
      await this.usersRepository.save(user);
    }
  }

  async incrementLoginAttempts(userId: number): Promise<void> {
    const user = await this.findOne(userId);
    user.loginAttempts += 1;
    
    if (user.loginAttempts >= 5) {
      user.blockedUntil = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos
    }
    
    await this.usersRepository.save(user);
  }

  async resetLoginAttempts(userId: number): Promise<void> {
    await this.usersRepository.update(userId, {
      loginAttempts: 0,
      blockedUntil: null,
    });
  }

  async enableMfa(userId: number) {
    const user = await this.findOne(userId);
    user.isMfaEnabled = true;
    return this.usersRepository.save(user);
  }

  async verifyMfa(userId: number, token: string) {
    // Implementar verificación MFA
  }

  async enableBiometric(userId: number) {
    const user = await this.findOne(userId);
    user.isBiometricEnabled = true;
    return this.usersRepository.save(user);
  }

  async updateProfile(userId: number, data: any) {
    return this.usersRepository.update(userId, data);
  }

  async updateStatus(id: number, isActive: boolean): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    user.isActive = isActive;
    return this.usersRepository.save(user);
  }

  async search(term: string): Promise<User[]> {
    return this.usersRepository.find({
      where: [
        { name: Like(`%${term}%`) },
        { email: Like(`%${term}%`) },
        { documentNumber: Like(`%${term}%`) }
      ]
    });
  }

  async resetPassword(id: number): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const temporaryPassword = Math.random().toString(36).slice(-8);
    user.password = await bcrypt.hash(temporaryPassword, 10);
    await this.usersRepository.save(user);
    // Aquí se podría agregar el envío de email con la nueva contraseña
  }

  async exportToExcel(): Promise<Buffer> {
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

      const worksheet = xlsx.utils.json_to_sheet(
        users.map(user => ({
          'Nombre': user.name || '',
          'Email': user.email || '',
          'Documento': user.documentNumber || '',
          'Teléfono': user.phoneNumber || '',
          'Rol': user.role || '',
          'Estado': user.isActive ? 'Activo' : 'Inactivo',
          'Dirección': user.address || '',
          'Cargo': user.position || '',
          'Departamento': user.department || ''
        }))
      );

      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Usuarios');
      
      return xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    } catch (error) {
      throw new Error(`Error al exportar usuarios: ${error.message}`);
    }
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    try {
      const user = await this.findOne(id);
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      // Limpiar y validar los datos
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
        'emergencyContact',    // Añadido
        'emergencyPhone',      // Añadido
      ];

      const cleanedData = Object.keys(userData)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = userData[key];
          return obj;
        }, {});

      // Actualizar usuario
      Object.assign(user, cleanedData);
      const updatedUser = await this.usersRepository.save(user);
      
      // Eliminar campos sensibles
      const { password, ...result } = updatedUser;
      return result as User;
    } catch (error) {
      throw new HttpException(
        `Error al actualizar usuario: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateLastLogin(userId: number): Promise<void> {
    await this.usersRepository.update(userId, {
      lastLogin: new Date(),
    });
  }
}
