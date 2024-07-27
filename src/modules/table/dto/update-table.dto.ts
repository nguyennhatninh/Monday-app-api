import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTableDTO {
  @ApiProperty({
    name: 'name',
    type: String,
    description: 'The name of the table',
    example: 'Learn nestjs'
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
