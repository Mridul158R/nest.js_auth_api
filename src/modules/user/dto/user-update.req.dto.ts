// src/user/dto/user-update.req.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UserUpdateRequestDto {
  @ApiProperty({
    description: 'Enter the new name',
    example: 'Jhon Doe'
})


  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Enter the new Email',
    example: 'Jhon70@gmail.com'
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Enter your new Email',
    example: 'Password@123'
})
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
