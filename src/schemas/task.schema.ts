import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { StatusTask } from 'src/global/globalEnum';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop({ default: undefined })
  date: Date;

  @Prop({ default: StatusTask.NOTSTARTED })
  status: StatusTask;

  @Prop({ type: Types.ObjectId, ref: 'Table' })
  table: Types.ObjectId;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

const TaskModel = SchemaFactory.createForClass(Task);

export const TaskSchema = TaskModel;
