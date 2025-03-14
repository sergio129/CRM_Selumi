import { Controller, Get, Param, Delete, Post, Body, Put } from '@nestjs/common';
import { AccountingService } from './accounting.service';
import { Transaction } from './transaction.entity';

@Controller('accounting')
export class AccountingController {
  constructor(private readonly accountingService: AccountingService) {}

  @Get()
  findAll(): Promise<Transaction[]> {
    return this.accountingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Transaction> {
    return this.accountingService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.accountingService.remove(+id);
  }

  @Post()
  create(@Body() transaction: Transaction): Promise<Transaction> {
    return this.accountingService.create(transaction);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() transaction: Transaction): Promise<void> {
    return this.accountingService.update(+id, transaction);
  }
}
