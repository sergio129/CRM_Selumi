import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  documentType: string;

  @Column()
  documentNumber: string;

  @Column()
  birthDate: Date;

  @Column()
  gender: string;

  @Column()
  maritalStatus: string;

  @Column()
  clientType: string;

  @Column()
  purchaseHistory: string;

  @Column()
  transactionHistory: string;

  @Column()
  contactPreference: string;

  @Column()
  notificationsSubscription: boolean;
}
