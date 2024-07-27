import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWorkspaceDTO {
  @ApiProperty({
    name: 'name',
    type: String,
    description: 'The name of the workspace'
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    name: 'owner',
    type: String,
    description: 'The user uses the workspace',
    example: '667a90878a27ed80df112617'
  })
  @IsNotEmpty()
  @IsString()
  owner: string;
}
