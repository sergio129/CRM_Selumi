import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';

@Injectable()
export class AccountingService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  findAll(): Promise<Transaction[]> {
    return this.transactionsRepository.find();
  }

  findOne(id: number): Promise<Transaction> {
    return this.transactionsRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.transactionsRepository.delete(id);
  }

  async create(transaction: Transaction): Promise<Transaction> {
    return this.transactionsRepository.save(transaction);
  }

  async update(id: number, transaction: Transaction): Promise<void> {
    await this.transactionsRepository.update(id, transaction);
  }
}
