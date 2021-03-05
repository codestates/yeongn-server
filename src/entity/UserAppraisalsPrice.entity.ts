import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'usersAppraisalsPrices' })
export class UserAppraisalsPrice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;
}
