import { LoansService } from './loans.service';
import { Loan } from './loan.entity';
export declare class LoansController {
    private readonly loansService;
    constructor(loansService: LoansService);
    findAll(): Promise<Loan[]>;
    findOne(id: string): Promise<Loan>;
    remove(id: string): Promise<void>;
    create(loan: Loan): Promise<Loan>;
    update(id: string, loan: Loan): Promise<void>;
}
