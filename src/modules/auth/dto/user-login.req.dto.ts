// src/user/dto/user-update.req.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UserLoginRequestDto {
 
    @ApiProperty({
        description: 'The email of User',
        example: 'Jhon70@gmail.com'
    })
  @IsEmail()
  username?: string;

  @ApiProperty({
    description: 'The password of User',
    example: 'Password@123'
})
  @IsString()
  password?: string;
}
