import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/\S+/)
  @MinLength(2, { message: 'Name is too short' })
  @MaxLength(50, { message: 'Name is too long' })
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly role: number;
}
