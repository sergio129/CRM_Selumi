import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  findAll(): Promise<Client[]> {
    return this.clientsRepository.find();
  }

  findOne(id: number): Promise<Client> {
    return this.clientsRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.clientsRepository.delete(id);
  }

  async create(client: Client): Promise<Client> {
    return this.clientsRepository.save(client);
  }

  async update(id: number, client: Client): Promise<void> {
    await this.clientsRepository.update(id, client);
  }
}
