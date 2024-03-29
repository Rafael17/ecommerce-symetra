import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from 'src/discounts/entities/discount.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRoles } from './enums/user-roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, lastName, firstName } = createUserDto;
    const user = await this.userRepository.findOneBy({ email });

    if (!!user) {
      throw new ConflictException('Email already exists');
    }

    const newUser = new User();
    newUser.email = email;
    newUser.lastName = lastName;
    newUser.firstName = firstName;
    newUser.userRole = UserRoles.CUSTOMER;
    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: {
        discounts: true,
      },
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        discounts: true,
      },
    });
    if (!user) {
      throw new HttpException(
        'User not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return user;
  }

  async findOneQuery(query) {
    const user = await this.userRepository.findOne(query);
    if (!user) {
      throw new HttpException(
        'User not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return user;
  }

  async findUserOrders(id: number): Promise<Order[]> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        orders: true,
      },
    });
    if (!user) {
      throw new HttpException(
        'User not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return user.orders;
  }

  async getDashboard(id: number) {
    const user = await this.findOne(id);
    if (user.userRole === UserRoles.ADMIN) {
      return this.getAdminDashboard();
    }
    return this.getCustomerDashboard(user);
  }

  async getAdminDashboard() {
    const discounts = (await this.discountRepository
      .createQueryBuilder('discount')
      .loadRelationCountAndMap('discount.customerCount', 'discount.users')
      .getMany()) as any;

    const discountsGiven = discounts.reduce(
      (prev, curr) => prev + curr.customerCount,
      0,
    );

    const totalPurchases = await this.orderRepository.count();

    return { discountsGiven, totalPurchases };
  }

  async getCustomerDashboard(user: User) {
    const discountCodes = user.discounts.map((discount) => discount.code) || [];
    return {
      discountCodes,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });
    const { email, lastName, firstName } = updateUserDto;
    if (email) {
      user.email = email;
    }
    if (lastName) {
      user.lastName = lastName;
    }
    if (firstName) {
      user.firstName = firstName;
    }
    return this.userRepository.save(user);
  }

  save(user: User) {
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (user?.userRole === UserRoles.ADMIN) {
      throw new ConflictException('Not allowed to delete admin user');
    }
    if (!!user) {
      await this.userRepository.delete(id);
    }
  }
}
