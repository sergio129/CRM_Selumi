import { RolesService } from './roles.service';
import { Role } from './role.entity';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    findAll(): Promise<Role[]>;
    findOne(id: string): Promise<Role>;
    remove(id: string): Promise<void>;
    create(role: Role): Promise<Role>;
    update(id: string, role: Role): Promise<void>;
}
