import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { Discount } from './entities/discount.entity';

@Injectable()
export class DiscountsService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
  ) {}
  async create(createDiscountDto: CreateDiscountDto) {
    const { code, discountAmount, nthTransaction } = createDiscountDto;

    const isCodeExist = await this.discountRepository.findOne({
      where: { code },
    });
    if (!!isCodeExist) {
      throw new ConflictException('Discount code already exists');
    }

    const newDiscount = new Discount();
    newDiscount.code = code;
    newDiscount.discountAmount = discountAmount;
    newDiscount.nthTransaction = nthTransaction;

    return this.discountRepository.save(newDiscount);
  }

  async findAll(): Promise<Discount[]> {
    return this.discountRepository.find();
  }

  async findOne(id: number): Promise<Discount> {
    return this.discountRepository.findOneBy({ id });
  }

  async update(id: number, updateDiscountDto: UpdateDiscountDto) {
    const discount = await this.discountRepository.findOneBy({ id });
    if (!discount) {
      throw new NotFoundException();
    }
    const { discountAmount, code, nthTransaction } = updateDiscountDto;
    if (discountAmount) {
      discount.discountAmount = discountAmount;
    }
    if (code) {
      discount.code = code;
    }
    if (nthTransaction) {
      discount.nthTransaction = nthTransaction;
    }
    return this.discountRepository.save(discount);
  }

  async remove(id: number) {
    const results = await this.discountRepository.delete({ id });
    if (results.affected === 0) {
      throw new NotFoundException();
    }
  }
}
