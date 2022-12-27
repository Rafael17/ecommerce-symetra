import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from 'src/discounts/entities/discount.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    const { productId, quantity, userId, discountCode } = createOrderDto;
    const product = await this.productRepository.findOneBy({ id: productId });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { discounts: true },
    });

    if (product.quantity < quantity) {
      throw new ConflictException('Not enough inventory to proccess order');
    }

    let discountAmount = 0;
    if (discountCode) {
      discountAmount =
        user.discounts.find((discount) => discount.code === discountCode)
          ?.discountAmount || 0;
    }

    const order = new Order();
    order.product = product;
    order.quantity = quantity;
    order.total = quantity * product.price - discountAmount;
    order.total = order.total > 0 ? order.total : 0;
    order.user = user;

    await this.orderRepository.save(order);
    const discounts = await this.discountRepository.find({
      order: { id: 'DESC' },
      take: 1,
    });
    const latestDiscount = discounts[0];
    const orderCount = await this.orderRepository.count();
    if (latestDiscount && orderCount % latestDiscount.nthTransaction === 0) {
      user.discounts = [...(user.discounts || []), latestDiscount];
      this.userRepository.save(user);
    }
  }

  async findAll() {
    return this.orderRepository.find({ relations: { product: true } });
  }

  findOne(id: number) {
    return this.orderRepository.findOneBy({ id });
  }
}
