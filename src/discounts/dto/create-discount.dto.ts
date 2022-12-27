import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDiscountDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  discountAmount: number;

  @IsNotEmpty()
  @IsNumber()
  nthTransaction: number;
}
