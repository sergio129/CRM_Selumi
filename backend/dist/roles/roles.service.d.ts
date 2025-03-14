import { Repository } from 'typeorm';
import { Role } from './role.entity';
export declare class RolesService {
    private rolesRepository;
    constructor(rolesRepository: Repository<Role>);
    findAll(): Promise<Role[]>;
    findOne(id: number): Promise<Role>;
    remove(id: number): Promise<void>;
    create(role: Role): Promise<Role>;
    update(id: number, role: Role): Promise<void>;
}
