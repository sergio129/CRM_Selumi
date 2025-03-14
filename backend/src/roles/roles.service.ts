import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  findAll(): Promise<Role[]> {
    return this.rolesRepository.find();
  }

  findOne(id: number): Promise<Role> {
    return this.rolesRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.rolesRepository.delete(id);
  }

  async create(role: Role): Promise<Role> {
    return this.rolesRepository.save(role);
  }

  async update(id: number, role: Role): Promise<void> {
    await this.rolesRepository.update(id, role);
  }
}
