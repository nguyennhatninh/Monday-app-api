import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Table, TableSchema } from '../../schemas/table.shema';
import { Task, TaskSchema } from '../../schemas/task.schema';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Table.name, schema: TableSchema },
      { name: Task.name, schema: TaskSchema }
    ])
  ],
  providers: [JwtService, TaskService],
  controllers: [TaskController],
  exports: [TaskService]
})
export class TaskModule {}
