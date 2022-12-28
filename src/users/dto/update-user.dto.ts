import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John',
    description: 'First name',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Smith',
    description: 'Last name',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'rafael@test.com',
    description: 'Email of user',
  })
  @IsEmail()
  email: string;
}
