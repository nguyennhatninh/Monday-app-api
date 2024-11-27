import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { UpdateWorkspaceDTO } from './dto';
import { Workspace, WorkspaceDocument } from '../../schemas/workspace.schema';
import { Table, TableDocument } from '../../schemas/table.shema';
import { Task, TaskDocument } from '../../schemas/task.schema';
import { User, UserDocument } from '../../schemas/user.schema';
import { DueDate, QueryWorkspaceDTO } from './dto/querry-workspace.dto';
import { StatusTask } from 'src/common/enum';

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
    await this.userModel
      .findOneAndUpdate({ workspaces: workspaceId }, { $pull: { workspaces: workspaceId } }, { new: true })
      .exec();
    await this.workspaceModel.deleteOne({ _id: workspaceId }).exec();
  }

  async getWorkspaceTasks(id: string, dto?: QueryWorkspaceDTO): Promise<Table[]> {
    const workspaceId = new mongoose.Types.ObjectId(id);
    const { query, status, dueDate, tableId, sortBy, sortOrder } = dto || {};

    const now = new Date();
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(startOfThisWeek.getDate() - ((startOfThisWeek.getDay() || 7) - 1));
    startOfThisWeek.setHours(0, 0, 0, 0);

    const endOfThisWeek = new Date(startOfThisWeek);
    endOfThisWeek.setDate(endOfThisWeek.getDate() + 6);
    endOfThisWeek.setHours(23, 59, 59, 999);

    const startOfNextWeek = new Date(startOfThisWeek);
    startOfNextWeek.setDate(startOfNextWeek.getDate() + 7);

    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(endOfNextWeek.getDate() + 6);
    endOfNextWeek.setHours(23, 59, 59, 999);

    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfThisMonth.setHours(23, 59, 59, 999);

    const taskFilters: Record<string, any> = {};

    if (query) {
      taskFilters.name = { $regex: query, $options: 'i' };
    }

    if (status) {
      taskFilters.status = status;
    }

    if (dueDate) {
      switch (dueDate) {
        case DueDate.PAST_DATE:
          taskFilters.date = { $lt: new Date(now.setHours(0, 0, 0, 0)) };
          break;
        case DueDate.OVERDUE:
          taskFilters.$and = [{ status: { $ne: StatusTask.DONE } }, { date: { $lt: now } }];
          break;
        case DueDate.TODAY:
          taskFilters.date = {
            $gte: new Date(now.setHours(0, 0, 0, 0)),
            $lt: new Date(now.setHours(24, 0, 0, 0))
          };
          break;
        case DueDate.TOMORROW:
          taskFilters.date = {
            $gte: new Date(now.setHours(24, 0, 0, 0)),
            $lt: new Date(now.setHours(48, 0, 0, 0))
          };
          break;
        case DueDate.THIS_WEEK:
          taskFilters.date = {
            $gte: startOfThisWeek,
            $lte: endOfThisWeek
          };
          break;
        case DueDate.NEXT_WEEK:
          taskFilters.date = {
            $gte: startOfNextWeek,
            $lte: endOfNextWeek
          };
          break;
        case DueDate.THIS_MONTH:
          taskFilters.date = {
            $gte: startOfThisMonth,
            $lte: endOfThisMonth
          };
          break;
      }
    }

    const tableFilters: Record<string, any> = { workspace: workspaceId };
    if (tableId) {
      tableFilters._id = new mongoose.Types.ObjectId(tableId);
    }

    const sortField = sortBy === 'name' || sortBy === 'date' ? sortBy : 'createdAt';
    const sortDirection = sortOrder === 'desc' ? -1 : 1;

    const tables = await this.tableModel.aggregate([
      { $match: tableFilters },
      {
        $lookup: {
          from: 'tasks',
          let: { taskIds: '$tasks' },
          pipeline: [
            { $match: { $expr: { $in: ['$_id', '$$taskIds'] } } },
            ...(Object.keys(taskFilters).length > 0 ? [{ $match: taskFilters }] : []),
            { $sort: { [sortField]: sortDirection } }
          ],
          as: 'tasks'
        }
      },
      { $match: { tasks: { $ne: [] } } }
    ]);

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
