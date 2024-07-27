import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateWorkspaceDTO {
  @ApiProperty({
    name: 'name',
    type: String,
    description: 'The name of the workspace'
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
