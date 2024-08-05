import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDTO {
  @ApiProperty({
    name: 'refreshToken',
    type: String
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
