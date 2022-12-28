import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Discount } from 'src/discounts/entities/discount.entity';
import { User } from 'src/users/entities/user.entity';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Discount, User]), ProductsModule],
  exports: [TypeOrmModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
