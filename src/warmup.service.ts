import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users/entities/user.entity';
import { UserRoles } from './users/enums/user-roles.enum';
import { faker } from '@faker-js/faker';
import { Product } from './products/entities/product.entity';

@Injectable()
export class WarmupService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async onApplicationBootstrap() {
    const admin = this.generateAdmin();
    await this.userRepository.save(admin);

    const array = Array.from(Array(10).keys());

    const users = array.map(this.generateUser);
    users.map((user) => this.userRepository.save(user));

    const products = array.map(this.generateProduct);
    products.map((product) => this.productRepository.save(product));
  }

  generateAdmin() {
    const admin = new User();
    admin.userRole = UserRoles.ADMIN;
    admin.firstName = 'admin';
    admin.lastName = 'admin';
    admin.email = 'admin@admin.com';
    return admin;
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
