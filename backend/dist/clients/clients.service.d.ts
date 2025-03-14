import { Repository } from 'typeorm';
import { Client } from './client.entity';
export declare class ClientsService {
    private clientsRepository;
    constructor(clientsRepository: Repository<Client>);
    findAll(): Promise<Client[]>;
    findOne(id: number): Promise<Client>;
    remove(id: number): Promise<void>;
    create(client: Client): Promise<Client>;
    update(id: number, client: Client): Promise<void>;
}
