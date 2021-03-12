import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './User.entity';
import { SalesComment } from './SalesComment.entity';

@Entity({ name: 'sales' })
export class Sale {
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

  @Column()
  contact: string;

  @Column('varchar', { length: 1000 })
  imgUrl: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.sales, {
    onDelete: 'CASCADE',
  })
  user: User;
  @Column()
  userId: number;

  @OneToMany(() => SalesComment, (salesComment) => salesComment.sale)
  salesComments: SalesComment[];
}
