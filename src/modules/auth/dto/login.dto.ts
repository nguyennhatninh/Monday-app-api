import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    name: 'email',
    type: String,
    description: 'The email is registered',
    example: 'example@example.com'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    name: 'password',
    type: String,
    description: 'Your password',
    example: 'password123'
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
