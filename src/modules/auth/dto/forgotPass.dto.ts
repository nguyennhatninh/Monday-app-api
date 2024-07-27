import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPassDTO {
  @ApiProperty({
    name: 'email',
    type: String,
    description: 'The eamil of user',
    example: 'example@example.com'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
