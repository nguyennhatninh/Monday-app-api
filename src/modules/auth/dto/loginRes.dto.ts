import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../../schemas/user.schema';

export class LoginResDTO {
  @ApiProperty({
    name: 'userInfo',
    type: User,
    description: 'Info of User'
  })
  @IsNotEmpty()
  userInfo: User;

  @ApiProperty({
    name: 'accessToken',
    type: String,
    description: 'Access token'
  })
  @IsNotEmpty()
  @IsString()
  accessToken: string;
}
