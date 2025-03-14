import { Controller, Get, Param, Delete, Post, Body, Put } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { Client } from './client.entity';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  findAll(): Promise<Client[]> {
    return this.clientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Client> {
    return this.clientsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.clientsService.remove(+id);
  }

  @Post()
  create(@Body() client: Client): Promise<Client> {
    return this.clientsService.create(client);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() client: Client): Promise<void> {
    return this.clientsService.update(+id, client);
  }
}
