import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  @Column({ type: 'datetime', default: 'now()' })
  createdAt: Date;
}
