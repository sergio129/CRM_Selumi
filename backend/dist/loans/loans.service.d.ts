import { Repository } from 'typeorm';
import { Loan } from './loan.entity';
export declare class LoansService {
    private loansRepository;
    constructor(loansRepository: Repository<Loan>);
    findAll(): Promise<Loan[]>;
    findOne(id: number): Promise<Loan>;
    remove(id: number): Promise<void>;
    create(loan: Loan): Promise<Loan>;
    update(id: number, loan: Loan): Promise<void>;
}
