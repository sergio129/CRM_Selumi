import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from './loan.entity';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private loansRepository: Repository<Loan>,
  ) {}

  findAll(): Promise<Loan[]> {
    return this.loansRepository.find();
  }

  findOne(id: number): Promise<Loan> {
    return this.loansRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.loansRepository.delete(id);
  }

  async create(loan: Loan): Promise<Loan> {
    return this.loansRepository.save(loan);
  }

  async update(id: number, loan: Loan): Promise<void> {
    await this.loansRepository.update(id, loan);
  }
}
