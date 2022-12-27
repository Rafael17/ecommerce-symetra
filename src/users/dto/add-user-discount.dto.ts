import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddUserDiscountDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  discountId: number;
}
