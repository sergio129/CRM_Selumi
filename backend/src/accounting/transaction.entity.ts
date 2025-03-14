import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  description: string;

  @Column()
  amount: number;

  @Column()
  paymentMethod: string;

  @Column()
  clientId: number;

  @Column()
  type: string; // income or expense
}
