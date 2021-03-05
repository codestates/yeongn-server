import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Appraisal } from './Appraisal.entity';

@Entity({ name: 'appraisalsImages' })
export class AppraisalsImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @ManyToOne(() => Appraisal, (appraisal) => appraisal.appraisalsImages)
  appraisal: Appraisal;
}
