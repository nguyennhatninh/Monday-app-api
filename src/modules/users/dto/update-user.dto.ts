import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Role } from '../../../common/enum';

export class UpdateUserDTO {
  @ApiProperty({
    name: 'name',
    type: String,
    description: 'The name of user',
    example: 'Nguyen Nhat Ninh'
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    name: 'roles',
    type: Array,
    description: 'The roles of user',
    example: ['user']
  })
  @IsOptional()
  roles: Role[];

  @ApiProperty({
    name: 'email',
    type: String,
    description: 'The email of user',
    example: 'example@example.com'
  })
  @IsOptional()
  @IsString()
  email: string;
}
