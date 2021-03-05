import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'salesComments' })
export class SalesComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({ type: 'datetime', default: 'now()' })
  createdAt: Date;
}
