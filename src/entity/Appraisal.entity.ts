import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './User.entity';
import { AppraisalsComment } from './AppraisalsComment.entity';
import { UsersAppraisalsPrice } from './UsersAppraisalsPrice.entity';

@Entity({ name: 'appraisals' })
export class Appraisal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string;

  @Column()
  itemName: string;

  @Column()
  userPrice: string;

  @Column('varchar', { length: 1000 })
  description: string;

  @Column('varchar', { length: 1000 })
  imgUrl: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.appraisals, {
    onDelete: 'CASCADE',
  })
  user: User;
  @Column()
  userId: number;

  @OneToMany(
    () => AppraisalsComment,
    (appraisalsComment) => appraisalsComment.appraisal,
  )
  appraisalsComments: AppraisalsComment[];

  @OneToMany(
    () => UsersAppraisalsPrice,
    (usersAppraisalsPrice) => usersAppraisalsPrice.appraisal,
  )
  usersAppraisalsPrices: UsersAppraisalsPrice[];
}
