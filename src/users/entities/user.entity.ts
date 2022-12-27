import { Discount } from '../../discounts/entities/discount.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRoles } from '../enums/user-roles.enum';
import { Order } from 'src/orders/entities/order.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  userRole: UserRoles;

  @ManyToMany(() => Discount, (discount) => discount.users)
  @JoinTable()
  discounts: Discount[];

  @OneToMany(() => Order, (order) => order.user)
  @JoinTable()
  orders: Order[];
}
