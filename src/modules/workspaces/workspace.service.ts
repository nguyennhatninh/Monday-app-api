import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { UpdateWorkspaceDTO } from './dto';
import { Workspace, WorkspaceDocument } from '../../schemas/workspace.schema';
import { Table, TableDocument } from '../../schemas/table.shema';
import { Task, TaskDocument } from '../../schemas/task.schema';
import { User, UserDocument } from '../../schemas/user.schema';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Workspace.name) private workspaceModel: Model<WorkspaceDocument>,
    @InjectModel(Table.name) private tableModel: Model<TableDocument>,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>
  ) {}
  async createWorkspace(id: string): Promise<Workspace> {
    const userId = new mongoose.Types.ObjectId(id);
    const createdWorkspace = new this.workspaceModel({
      name: 'New Workspace',
      owner: userId
    });
    await createdWorkspace.save();

    for (let i = 1; i <= 2; i++) {
      const createdTable = new this.tableModel({
        name: `Table Title ${i}`,
        workspace: createdWorkspace._id
      });
      await createdTable.save();

      const createdTask = new this.taskModel({
        name: 'New Task',
        table: createdTable._id
      });
      await createdTask.save();
      createdWorkspace.tables.push(createdTable._id);
      await createdWorkspace.save();

      createdTable.tasks = [createdTask._id];
      await createdTable.save();
    }
    await this.userModel.updateOne({ _id: userId }, { $push: { workspaces: createdWorkspace._id } });
    return createdWorkspace;
  }

  async deleteWorkspace(id: string): Promise<void> {
    const workspaceId = new mongoose.Types.ObjectId(id);
    const workspace = await this.workspaceModel.findById(id).exec();
    const tableIds = workspace.tables;
    await this.taskModel.deleteMany({ table: { $in: tableIds } }).exec();
    await this.tableModel.deleteMany({ workspace: workspaceId }).exec();
    await this.workspaceModel.deleteOne({ _id: workspaceId }).exec();
  }

  async getWorkspaceTasks(id: string): Promise<Table[]> {
    const workspaceId = new mongoose.Types.ObjectId(id);
    const tables = await this.tableModel
      .find({ workspace: workspaceId })
      .populate({
        path: 'tasks',
        select: 'name date status'
      })
      .exec();

    return tables;
  }

  async findById(id: string): Promise<Workspace | null> {
    return this.workspaceModel.findById(id).exec();
  }

  async findAll(): Promise<Workspace[]> {
    return this.workspaceModel.find().exec();
  }

  async update(id: string, data: UpdateWorkspaceDTO): Promise<Workspace | null> {
    return this.workspaceModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }
}
