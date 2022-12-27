import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Product } from 'src/products/entities/product.entity';

export class CreateOrderDto {
  @ApiProperty({
    example: 1,
    description: 'Product id',
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({
    example: 2,
    description: 'Count of items to purchase',
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    example: 2,
    description: 'User id',
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    example: '40_OFF_WINTER_SALE',
    description: 'Discount code',
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  discountCode?: string;
}
