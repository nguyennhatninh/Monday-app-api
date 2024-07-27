import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateTableDTO, UpdateTableDTO } from './dto';
import { Table } from '../../schemas/table.shema';
import { Task } from '../../schemas/task.schema';
import { Workspace } from '../../schemas/workspace.schema';
import { BaseService } from '../../common/helper';

@Injectable()
export class TableService extends BaseService<Table, CreateTableDTO, UpdateTableDTO> {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(Table.name) private tableModel: Model<Table>,
    @InjectModel(Workspace.name) private workspaceModel: Model<Workspace>
  ) {
    super(tableModel);
  }

  async createTable(infoCreateTableDto: CreateTableDTO): Promise<Table> {
    const workspaceId = new mongoose.Types.ObjectId(infoCreateTableDto.workspace);
    const createdTable = await this.tableModel.create({ ...infoCreateTableDto, workspace: workspaceId });
    const createdTask = await this.taskModel.create({ name: 'New Task', table: createdTable._id });
    createdTable.tasks.push(createdTask._id);
    await createdTable.save();
    await this.workspaceModel.updateOne({ _id: workspaceId }, { $push: { tables: createdTable._id } });
    return createdTable;
  }

  async deleteTable(id: string): Promise<void> {
    const tableId = new mongoose.Types.ObjectId(id);
    await this.taskModel.deleteMany({ table: tableId }).exec();
    await this.workspaceModel
      .findOneAndUpdate({ tables: tableId }, { $pull: { tables: tableId } }, { new: true })
      .exec();
    await this.tableModel.deleteOne({ _id: id }).exec();
  }

  async getTableTasks(id: string): Promise<Task[]> {
    const tableId = new mongoose.Types.ObjectId(id);
    const tasks = await this.taskModel.find({ table: tableId }).exec();
    return tasks;
  }
}
