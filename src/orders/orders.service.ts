import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from 'src/discounts/entities/discount.entity';
import { Product } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    private readonly productService: ProductsService,
    private readonly usersService: UsersService,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    const { productId, quantity, userId, discountCode } = createOrderDto;
    const product = await this.productService.findOne(productId);
    const user = await this.usersService.findOneQuery({
      where: { id: userId },
      relations: { discounts: true },
    });

    if (product.quantity < quantity) {
      throw new ConflictException('Not enough inventory to proccess order');
    }

    let amount = 0;
    if (discountCode) {
      amount =
        user.discounts.find((discount) => discount.code === discountCode)
          ?.amount || 0;
    }

    const order = new Order();
    order.product = product;
    order.quantity = quantity;
    order.total = quantity * product.price - amount;
    order.total = order.total > 0 ? order.total : 0;
    order.user = user;

    const newOrder = await this.orderRepository.save(order);
    const discounts = await this.discountRepository.find({
      order: { id: 'DESC' },
      take: 1,
    });
    const latestDiscount = discounts[0];
    const orderCount = await this.orderRepository.count();
    if (latestDiscount && orderCount % latestDiscount.nthTransaction === 0) {
      user.discounts = [...(user.discounts || []), latestDiscount];
      await this.usersService.save(user);
    }

    product.quantity = product.quantity - quantity;
    await this.productService.save(product);
    return newOrder;
  }

  async findAll() {
    return this.orderRepository.find({ relations: { product: true } });
  }

  findOne(id: number) {
    return this.orderRepository.findOneBy({ id });
  }
}
