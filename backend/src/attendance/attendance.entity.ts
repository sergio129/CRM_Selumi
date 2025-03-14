import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeId: number;

  @Column()
  checkInTime: Date;

  @Column()
  checkOutTime: Date;

  @Column()
  status: string; // present, absent, late, etc.
}
