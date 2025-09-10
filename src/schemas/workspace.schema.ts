import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import mongoose, { HydratedDocument, Types } from 'mongoose';

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

  @IsBoolean()
  @Prop({ default: true })
  task: boolean;

  @IsBoolean()
  @Prop({ default: true })
  date: boolean;

  @IsBoolean()
  @Prop({ default: true })
  person: boolean;

  @IsBoolean()
  @Prop({ default: true })
  status: boolean;

  @ApiProperty({
    name: 'owner',
    type: String,
    description: 'The user have the workspace'
  })
  @IsNotEmpty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true })
  owner: Types.ObjectId;

  @ApiProperty({
    name: 'tables',
    type: String,
    description: 'The tables of the table'
  })
  @IsNotEmpty()
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Table' }] })
  tables: Types.ObjectId[];
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
