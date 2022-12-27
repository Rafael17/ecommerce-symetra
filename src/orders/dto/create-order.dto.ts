import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Product } from 'src/products/entities/product.entity';

export class CreateOrderDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @Type(() => String)
  @IsString()
  @IsOptional()
  discountCode?: string;
}
