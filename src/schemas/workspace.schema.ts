import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
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

  @ApiProperty({
    name: 'created_at',
    type: Date,
    description: 'The time workspace is created'
  })
  @IsNotEmpty()
  @IsDate()
  @Prop({ default: Date.now })
  created_at: Date;

  @ApiProperty({
    name: 'updated_at',
    type: Date,
    description: 'The time workspace is updated'
  })
  @IsNotEmpty()
  @IsDate()
  @Prop({ default: Date.now })
  updated_at: Date;
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
