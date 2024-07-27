import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CreateWorkspaceDTO, UpdateWorkspaceDTO } from './dto';
import { Workspace, WorkspaceDocument } from '../../schemas/workspace.schema';
import { Table, TableDocument } from '../../schemas/table.shema';
import { Task, TaskDocument } from '../../schemas/task.schema';
import { User, UserDocument } from '../../schemas/user.schema';
import { BaseService } from '../../common/helper';

@Injectable()
export class WorkspaceService extends BaseService<Workspace, CreateWorkspaceDTO, UpdateWorkspaceDTO> {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Workspace.name) private workspaceModel: Model<WorkspaceDocument>,
    @InjectModel(Table.name) private tableModel: Model<TableDocument>,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>
  ) {
    super(workspaceModel);
  }
  async createWorkspace(dto: CreateWorkspaceDTO): Promise<Workspace> {
    const userId = new mongoose.Types.ObjectId(dto.owner);
    const createdWorkspace = new this.workspaceModel({
      name: dto.name,
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

  async getWorkspaceTables(id: string): Promise<Table[]> {
    const workspaceId = new mongoose.Types.ObjectId(id);
    const tables = await this.tableModel.find({ workspace: workspaceId }).exec();
    return tables;
  }
}
