interface BankTransferDetails {
    bankName: string;
    accountNumber: string;
    accountType: string;
    amount: number;
    reference: string;
    beneficiary: string;
}
export declare class BankIntegrationService {
    processPayrollTransfer(transferDetails: BankTransferDetails): Promise<boolean>;
    validateBankAccount(bankName: string, accountNumber: string): Promise<boolean>;
    getBanksList(): Promise<string[]>;
    getTransactionStatus(reference: string): Promise<string>;
}
export {};
