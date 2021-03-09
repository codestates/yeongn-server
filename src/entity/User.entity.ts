import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Appraisal } from './Appraisal.entity';
import { Sale } from './Sale.entity';
import { AppraisalsComment } from './AppraisalsComment.entity';
import { SalesComment } from './SalesComment.entity';
import { UsersAppraisalsPrice } from './UsersAppraisalsPrice.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nickname: string;

  @Column()
  socialId: string;

  @Column()
  social: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => Appraisal, (appraisal) => appraisal.user)
  appraisals: Appraisal[];

  @OneToMany(() => Sale, (sale) => sale.user)
  sales: Sale[];

  @OneToMany(
    () => AppraisalsComment,
    (appraisalsComment) => appraisalsComment.user,
  )
  appraisalsComments: AppraisalsComment[];

  @OneToMany(() => SalesComment, (salesComment) => salesComment.user)
  salesComments: SalesComment[];

  @OneToMany(
    () => UsersAppraisalsPrice,
    (usersAppraisalsPrice) => usersAppraisalsPrice.user,
  )
  usersAppraisalsPrices: UsersAppraisalsPrice[];
}
