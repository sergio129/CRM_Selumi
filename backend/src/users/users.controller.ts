import { Controller, Get, Post, Put, Patch, Body, Param, Delete, UseGuards, Query, HttpException, HttpStatus, Res } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Response } from 'express';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    try {
      const users = await this.usersService.findAll();
      return {
        success: true,
        data: users,
        message: 'Usuarios recuperados exitosamente'
      };
    } catch (error) {
      throw new HttpException({
        success: false,
        message: 'Error al recuperar usuarios',
        error: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('export')
  async exportToExcel(@Res() res: Response) {
    try {
      const buffer = await this.usersService.exportToExcel();
      
      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=usuarios.xlsx',
        'Content-Length': buffer.length
      });
      
      res.send(buffer);
    } catch (error) {
      throw new HttpException({
        success: false,
        message: 'Error al exportar usuarios',
        error: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('search')
  async search(@Query('term') term: string) {
    return this.usersService.search(term);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOne(+id);
      if (!user) {
        throw new HttpException({
          success: false,
          message: 'Usuario no encontrado'
        }, HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        data: user,
        message: 'Usuario encontrado'
      };
    } catch (error) {
      throw new HttpException({
        success: false,
        message: 'Error al recuperar usuario',
        error: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(+id);
  }

  @Post('mfa/enable')
  async enableMfa(@Body() body: { userId: number }) {
    return this.usersService.enableMfa(body.userId);
  }

  @Post('mfa/verify')
  async verifyMfa(@Body() body: { userId: number, token: string }) {
    return this.usersService.verifyMfa(body.userId, body.token);
  }

  @Post('biometric/enable')
  async enableBiometric(@Body() body: { userId: number }) {
    return this.usersService.enableBiometric(body.userId);
  }

  @Put('profile')
  async updateProfile(@Body() body: any) {
    return this.usersService.updateProfile(body.userId, body);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean
  ) {
    return this.usersService.updateStatus(+id, isActive);
  }

  @Post(':id/reset-password')
  async resetPassword(@Param('id') id: string) {
    return this.usersService.resetPassword(+id);
  }

  @Post()
  async create(@Body() user: User) {
    try {
      // Validar que los campos requeridos estén presentes
      if (!user.name || !user.email || !user.documentNumber || !user.password) {
        throw new HttpException(
          'Faltan campos requeridos: nombre, email, número de documento y contraseña son obligatorios',
          HttpStatus.BAD_REQUEST
        );
      }

      // Limpiar el número de documento (quitar puntos y espacios)
      user.documentNumber = user.documentNumber.replace(/[.\s]/g, '');

      const newUser = await this.usersService.create(user);
      return {
        success: true,
        message: 'Usuario creado exitosamente',
        data: newUser
      };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          'El email o número de documento ya está registrado',
          HttpStatus.CONFLICT
        );
      }
      throw new HttpException(
        `Error al crear usuario: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() userData: any) {
    try {
      const updatedUser = await this.usersService.update(+id, userData);
      return {
        success: true,
        data: updatedUser,
        message: 'Usuario actualizado exitosamente'
      };
    } catch (error) {
      throw new HttpException({
        success: false,
        message: error.message || 'Error al actualizar usuario',
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
