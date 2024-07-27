import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTableDTO {
  @ApiProperty({
    name: 'name',
    type: String,
    description: 'The name of the table'
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    name: 'workspace',
    type: String,
    description: 'The workspace contains the table',
    example: '667a90878a27ed80df112617'
  })
  @IsNotEmpty()
  @IsString()
  workspace: string;
}
