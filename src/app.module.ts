import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { DiscountsModule } from './discounts/discounts.module';
import { Discount } from './discounts/entities/discount.entity';
import { SeedModule } from './seed/seed.module';
import { Product } from './products/entities/product.entity';
import { WarmupService } from './warmup.service';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      synchronize: true,
      entities: [User, Discount, Product, Order],
    }),
    UsersModule,
    ProductsModule,
    DiscountsModule,
    SeedModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService, WarmupService],
})
export class AppModule {}
