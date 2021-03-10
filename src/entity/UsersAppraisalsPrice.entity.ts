import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User.entity';
import { Appraisal } from './Appraisal.entity';

@Entity({ name: 'usersAppraisalsPrices' })
export class UsersAppraisalsPrice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @ManyToOne(() => User, (user) => user.usersAppraisalsPrices, {
    onDelete: 'CASCADE',
  })
  user: User;
  @Column()
  userId: number;

  @ManyToOne(() => Appraisal, (appraisal) => appraisal.usersAppraisalsPrices, {
    onDelete: 'CASCADE',
  })
  appraisal: Appraisal;
  @Column()
  appraisalId: number;
}
