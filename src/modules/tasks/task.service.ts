import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateTaskDTO, UpdateTaskDTO } from './dto';
import { Table } from '../../schemas/table.shema';
import { Task } from '../../schemas/task.schema';
import { BaseService } from '../../common/helper';

@Injectable()
export class TaskService extends BaseService<Task, CreateTaskDTO, UpdateTaskDTO> {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(Table.name) private tableModel: Model<Table>
  ) {
    super(taskModel);
  }

  async createTask(dto: CreateTaskDTO): Promise<Task> {
    const tableId = new mongoose.Types.ObjectId(dto.table);
    const createdTask = await this.taskModel.create({ ...dto, table: tableId });
    await this.tableModel.updateOne({ _id: tableId }, { $push: { tasks: createdTask._id } });
    return createdTask;
  }

  async deleteTask(id: string): Promise<void> {
    const taskId = new mongoose.Types.ObjectId(id);
    await this.tableModel.findOneAndUpdate({ tasks: taskId }, { $pull: { tasks: taskId } }, { new: true }).exec();
    await this.taskModel.deleteOne({ _id: id }).exec();
  }
}
