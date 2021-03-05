import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User.entity';
import { Appraisal } from './Appraisal.entity';

@Entity({ name: 'appraisalsComments' })
export class AppraisalsComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.appraisalsComments)
  user: User;

  @ManyToOne(() => Appraisal, (appraisal) => appraisal.appraisalsComments)
  appraisal: Appraisal;
}
