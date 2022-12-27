import { HttpException, Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { faker } from '@faker-js/faker';
import { UserRoles } from 'src/users/enums/user-roles.enum';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  create() {
    const array = Array.from(Array(10).keys());
    const users = array.map(this.generateUser);
    users.map((user) => this.userRepository.save(user));

    const products = array.map(this.generateProduct);
    products.map((product) => this.productRepository.save(product));
  }

  generateUser() {
    const user = new User();
    user.firstName = faker.name.firstName();
    user.lastName = faker.name.lastName();
    user.email = faker.internet.email();
    user.userRole = UserRoles.CUSTOMER;
    return user;
  }

  generateProduct() {
    const product = new Product();
    product.name = faker.commerce.productName();
    product.price = +faker.commerce.price();
    product.quantity = Math.floor(Math.random() * 100);
    return product;
  }
}
