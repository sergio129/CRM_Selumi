import { AccountingService } from './accounting.service';
import { Transaction } from './transaction.entity';
export declare class AccountingController {
    private readonly accountingService;
    constructor(accountingService: AccountingService);
    findAll(): Promise<Transaction[]>;
    findOne(id: string): Promise<Transaction>;
    remove(id: string): Promise<void>;
    create(transaction: Transaction): Promise<Transaction>;
    update(id: string, transaction: Transaction): Promise<void>;
}
