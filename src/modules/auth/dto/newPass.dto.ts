import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class NewPassWordDTO {
  @ApiProperty({
    name: 'password',
    type: String,
    description: 'The eamil of user',
    example: 'password1234'
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
