import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  documentType: string;

  @Column()
  documentNumber: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  birthDate: Date;

  @Column()
  gender: string;

  @Column()
  position: string;

  @Column()
  department: string;

  @Column()
  hireDate: Date;

  @Column()
  contractType: string;

  @Column()
  supervisor: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  baseSalary: number;

  @Column({ type: 'json', nullable: true })
  benefits: {
    healthInsurance?: number;
    transportationAllowance?: number;
    mealAllowance?: number;
    performanceBonus?: number;
  };

  @Column({ type: 'json', nullable: true })
  deductions: {
    tax?: number;
    pension?: number;
    socialSecurity?: number;
    loans?: number;
  };

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  overtimeHours: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  overtimeRate: number;

  @Column({ type: 'simple-array', nullable: true })
  paymentHistory: string[];

  @Column({ default: 'monthly' })
  paymentFrequency: string;

  @Column({ nullable: true })
  bankName: string;

  @Column({ nullable: true })
  bankAccountNumber: string;

  @Column({ nullable: true })
  bankAccountType: string;

  @Column({ type: 'date', nullable: true })
  lastPaymentDate: Date;

  @Column({ default: false })
  isIncomeTaxPayer: boolean; // Indica si el empleado es declarante de renta

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
