import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { StatusTask } from '../common/enum';
import { User } from './user.schema';

export type TaskDocument = HydratedDocument<Task>;
const now = new Date();

@Schema({ timestamps: true })
export class Task {
  @ApiProperty({
    name: 'name',
    type: String,
    description: 'The name of the task'
  })
  @IsNotEmpty()
  @IsString()
  @Prop({ index: true })
  name: string;

  @ApiProperty({
    name: 'date',
    type: Date,
    description: 'Deadline of the task'
  })
  @IsOptional()
  @Prop({ default: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`, index: true })
  date: Date;

  @Prop()
  person: User | null;

  @ApiProperty({
    name: 'status',
    type: String,
    description: 'The status of the task'
  })
  @IsNotEmpty()
  @IsString()
  @Prop({ default: StatusTask.NOT_STARTED, index: true })
  status: StatusTask;

  @ApiProperty({
    name: 'table',
    type: String,
    description: 'The table contains the task'
  })
  @IsNotEmpty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Table', index: true })
  table: Types.ObjectId;
}

const TaskModel = SchemaFactory.createForClass(Task);

export const TaskSchema = TaskModel;
TaskSchema.index({ status: 1, date: 1 });
