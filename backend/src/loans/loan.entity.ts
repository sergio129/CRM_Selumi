import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Loan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clientId: number;

  @Column()
  amount: number;

  @Column()
  interestRate: number;

  @Column()
  paymentTerm: string;

  @Column()
  collateral: string;

  @Column()
  status: string;
}
