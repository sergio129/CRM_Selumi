import { ClientsService } from './clients.service';
import { Client } from './client.entity';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    findAll(): Promise<Client[]>;
    findOne(id: string): Promise<Client>;
    remove(id: string): Promise<void>;
    create(client: Client): Promise<Client>;
    update(id: string, client: Client): Promise<void>;
}
