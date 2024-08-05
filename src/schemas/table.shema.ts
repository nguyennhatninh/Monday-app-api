import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';

export type TableDocument = HydratedDocument<Table>;

@Schema({ timestamps: true })
export class Table {
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
    name: 'workspace',
    type: String,
    description: 'The workspace contains the table'
  })
  @IsNotEmpty()
  @Prop({ type: Types.ObjectId, ref: 'Workspace' })
  workspace: Types.ObjectId;

  @ApiProperty({
    name: 'tasks',
    type: String,
    description: 'The tasks of the table'
  })
  @IsNotEmpty()
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Task' }] })
  tasks: Types.ObjectId[];
}

export const TableSchema = SchemaFactory.createForClass(Table);
