import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User.entity';
import { Sale } from './Sale.entity';

@Entity({ name: 'salesComments' })
export class SalesComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.salesComments)
  user: User;

  @ManyToOne(() => Sale, (sale) => sale.salesComments)
  sale: Sale;
}
