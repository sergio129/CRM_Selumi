import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
export declare class AccountingService {
    private transactionsRepository;
    constructor(transactionsRepository: Repository<Transaction>);
    findAll(): Promise<Transaction[]>;
    findOne(id: number): Promise<Transaction>;
    remove(id: number): Promise<void>;
    create(transaction: Transaction): Promise<Transaction>;
    update(id: number, transaction: Transaction): Promise<void>;
}
