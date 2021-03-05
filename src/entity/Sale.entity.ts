import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './User.entity';
import { SalesComment } from './SalesComment.entity';
import { SalesImage } from './SalesImage.entity';

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

  @Column()
  description: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.sales)
  user: User;

  @OneToMany(() => SalesComment, (salesComment) => salesComment.sale)
  salesComments: SalesComment[];

  @OneToMany(() => SalesImage, (salesImage) => salesImage.sale)
  salesImages: SalesImage[];
}
