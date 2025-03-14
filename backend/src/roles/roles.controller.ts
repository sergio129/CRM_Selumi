import { Controller, Get, Param, Delete, Post, Body, Put } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './role.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Role> {
    return this.rolesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.rolesService.remove(+id);
  }

  @Post()
  create(@Body() role: Role): Promise<Role> {
    return this.rolesService.create(role);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() role: Role): Promise<void> {
    return this.rolesService.update(+id, role);
  }
}
