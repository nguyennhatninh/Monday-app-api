import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from '../../../common/enum';

export class RegisterUserDTO {
  @ApiProperty({
    name: 'name',
    type: String,
    description: 'The name of user',
    example: 'Nguyen Nhat Ninh'
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    name: 'roles',
    type: Array,
    description: 'The roles of user',
    example: 'user'
  })
  @IsOptional()
  roles: Role;

  @ApiProperty({
    name: 'email',
    type: String,
    description: 'The email of user',
    example: 'example@example.com'
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    name: 'password',
    type: String,
    description: 'Password of user',
    example: 'password123'
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
