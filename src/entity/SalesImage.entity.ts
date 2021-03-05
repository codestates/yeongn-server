import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Sale } from './Sale.entity';

@Entity({ name: 'salesImages' })
export class SalesImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @ManyToOne(() => Sale, (sale) => sale.salesImages)
  sale: Sale;
}
