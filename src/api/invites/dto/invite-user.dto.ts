import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { ValidInviteRoleEnum } from '../enums/valid-invite-role.enum';

export class InviteUserDto {
  @ApiProperty({
    description: 'Invite email',
    example: 'example@email.com',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'Invite role',
    enum: ValidInviteRoleEnum,
    example: ValidInviteRoleEnum.USER_ROLE,
  })
  @IsNotEmpty()
  @IsEnum(ValidInviteRoleEnum)
  readonly role: ValidInviteRoleEnum;
}
