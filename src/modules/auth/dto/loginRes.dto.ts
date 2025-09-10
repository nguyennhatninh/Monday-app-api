import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginResDTO {
  @ApiProperty({
    name: 'refreshToken',
    type: String,
    description: 'Refresh token'
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;

  @ApiProperty({
    name: 'accessToken',
    type: String,
    description: 'Access token'
  })
  @IsNotEmpty()
  @IsString()
  accessToken: string;
}
