import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Employee } from '../payroll/employee.entity';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee)
  employee: Employee;

  @Column()
  employeeId: number;

  @CreateDateColumn()
  checkIn: Date;

  @Column({ nullable: true })
  checkOut: Date;

  @Column({
    type: 'enum',
    enum: ['onTime', 'late', 'earlyLeave', 'absent'],
    default: 'onTime'
  })
  status: string;

  @Column({ type: 'json', nullable: true })
  biometricData: any;
}
