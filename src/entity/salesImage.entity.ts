import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'salesImages' })
export class salesImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;
}
