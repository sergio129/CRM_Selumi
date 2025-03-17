import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ unique: true })
  documentNumber: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ type: 'text', nullable: true })
  profilePicture: string;

  @Column({ default: false })
  isBiometricEnabled: boolean;

  @Column({ default: false })
  isMfaEnabled: boolean;

  @Column({ nullable: true })
  mfaSecret: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  loginAttempts: number;

  @Column({ nullable: true })
  lastLogin: Date;

  @Column({ nullable: true })
  blockedUntil: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  verificationToken: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  emergencyContact: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  emergencyPhone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  position: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  department: string;
}
