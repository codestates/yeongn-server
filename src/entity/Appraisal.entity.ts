import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  @Column()
  description: string;

  @Column({ type: 'datetime', default: 'now()' })
  createdAt: Date;
}
