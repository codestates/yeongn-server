import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'appraisalsImages' })
export class AppraisalsImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;
}
