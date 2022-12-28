import { User } from '../../users/entities/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Discount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  amount: number;

  @ManyToMany(() => User, (user) => user.discounts, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  users: User[];

  @Column()
  nthTransaction: number;
}
