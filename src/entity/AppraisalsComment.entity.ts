import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'appraisalsComments' })
export class AppraisalsComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({ type: 'datetime', default: 'now()' })
  createdAt: Date;
}
