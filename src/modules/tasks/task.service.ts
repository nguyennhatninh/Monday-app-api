import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { InfoCreateTaskDto, InfoUpdateTaskDto } from './dto/task.dto';
import { Table } from '../../schemas/table.shema';
import { Task } from '../../schemas/task.schema';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(Table.name) private tableModel: Model<Table>
  ) {}
  async getTask(taskId: string): Promise<Task> {
    const task = await this.taskModel.findById(taskId).exec();
    return task;
  }
  async createTask(infoCreateTaskDto: InfoCreateTaskDto): Promise<Task> {
    const tableId = new mongoose.Types.ObjectId(infoCreateTaskDto.table);
    const createdTask = await this.taskModel.create({ ...infoCreateTaskDto, table: tableId });
    await this.tableModel.updateOne({ _id: tableId }, { $push: { tasks: createdTask._id } });
    return createdTask;
  }

  async updateTask(id: string, infoUpdateTaskDto: InfoUpdateTaskDto): Promise<Task> {
    const updatedTask = await this.taskModel.findByIdAndUpdate(id, { $set: infoUpdateTaskDto }, { new: true });
    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    const taskId = new mongoose.Types.ObjectId(id);
    await this.tableModel.findOneAndUpdate({ tasks: taskId }, { $pull: { tasks: taskId } }, { new: true }).exec();
    await this.taskModel.deleteOne({ _id: id }).exec();
  }
}
