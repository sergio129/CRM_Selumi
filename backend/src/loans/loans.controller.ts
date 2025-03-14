import { Controller, Get, Param, Delete, Post, Body, Put } from '@nestjs/common';
import { LoansService } from './loans.service';
import { Loan } from './loan.entity';

@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Get()
  findAll(): Promise<Loan[]> {
    return this.loansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Loan> {
    return this.loansService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.loansService.remove(+id);
  }

  @Post()
  create(@Body() loan: Loan): Promise<Loan> {
    return this.loansService.create(loan);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() loan: Loan): Promise<void> {
    return this.loansService.update(+id, loan);
  }
}
