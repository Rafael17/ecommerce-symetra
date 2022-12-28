import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { Response } from 'express';

@Controller('discounts')
@ApiTags('discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @Post()
  async create(
    @Body() createDiscountDto: CreateDiscountDto,
    @Res() res: Response,
  ) {
    const result = await this.discountsService.create(createDiscountDto);
    res.status(HttpStatus.CREATED).send(result);
  }

  @Get()
  findAll() {
    return this.discountsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.discountsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDiscountDto: UpdateDiscountDto,
    @Res() res: Response,
  ) {
    const result = await this.discountsService.update(+id, updateDiscountDto);
    res.status(HttpStatus.OK).send(result);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.discountsService.remove(+id);
  }
}
