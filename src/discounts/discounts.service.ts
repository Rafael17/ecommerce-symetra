import { ConflictException, HttpException, Injectable } from '@nestjs/common';
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

    await this.discountRepository.save(newDiscount);
  }

  async findAll(): Promise<Discount[]> {
    return this.discountRepository.find();
  }

  async findOne(id: number): Promise<Discount> {
    return this.discountRepository.findOneBy({ id });
  }

  update(id: number, updateDiscountDto: UpdateDiscountDto) {
    return `This action updates a #${id} discount`;
  }

  async remove(id: number) {
    await this.discountRepository.delete({ id });
  }
}
