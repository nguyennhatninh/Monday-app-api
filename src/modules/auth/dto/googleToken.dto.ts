import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class GoogleTokenDTO {
  @ApiProperty({
    name: 'idToken',
    type: String,
    description: 'Token'
  })
  @IsNotEmpty()
  @IsEmail()
  idToken: string;
}
