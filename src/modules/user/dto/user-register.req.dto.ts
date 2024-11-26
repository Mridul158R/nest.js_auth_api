import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { MESSAGES, REGEX } from '../../../app.utils';
import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterRequestDto {
    @ApiProperty({
        description: 'The name of User',
        example: 'Jhon Doe'
    })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The email of User',
    example: 'Jhon70@gmail.com'
})
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of User',
    example: 'Password@123'
})
  @IsNotEmpty()
  @Length(8, 24)
  @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
  password: string;

  @ApiProperty({
    description: 'Confirm the password',
    example: 'Password@123'
})
  @IsNotEmpty()
  @Length(8, 24)
  @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
  confirm: string;
}