import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';

export type WorkspaceDocument = HydratedDocument<Workspace>;

@Schema({ timestamps: true })
export class Workspace {
  @ApiProperty({
    name: 'name',
    type: String,
    description: 'The name of the table'
  })
  @IsNotEmpty()
  @IsString()
  @Prop()
  name: string;

  @ApiProperty({
    name: 'owner',
    type: String,
    description: 'The user have the workspace'
  })
  @IsNotEmpty()
  @Prop({ type: Types.ObjectId, ref: 'User' })
  owner: Types.ObjectId;

  @ApiProperty({
    name: 'tables',
    type: String,
    description: 'The tables of the table'
  })
  @IsNotEmpty()
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Table' }] })
  tables: Types.ObjectId[];
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
