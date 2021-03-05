import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User.entity';
import { Appraisal } from './Appraisal.entity';

@Entity({ name: 'usersAppraisalsPrices' })
export class UsersAppraisalsPrice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @ManyToOne(() => User, (user) => user.usersAppraisalsPrices)
  user: User;

  @ManyToOne(() => Appraisal, (appraisal) => appraisal.usersAppraisalsPrices)
  appraisal: Appraisal;
}
