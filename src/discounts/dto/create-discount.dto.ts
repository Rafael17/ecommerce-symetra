import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDiscountDto {
  @ApiProperty({
    example: '40_OFF_WINTER_SALE',
    description: 'Code',
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    example: 40,
    description: 'Amount',
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: 2,
    description: 'nth transaction to give the discount',
  })
  @IsNotEmpty()
  @IsNumber()
  nthTransaction: number;
}
