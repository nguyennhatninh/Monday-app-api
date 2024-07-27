import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { RegisterUserDTO, UpdateUserDTO } from './dto';
import { User } from '../../schemas/user.schema';
import { Workspace } from '../../schemas/workspace.schema';
import { Table } from '../../schemas/table.shema';
import { Task } from '../../schemas/task.schema';
import { BaseService } from '../../common/helper';

@Injectable()
export class UserService extends BaseService<User, RegisterUserDTO, UpdateUserDTO> {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Workspace.name) private workspaceModel: Model<Workspace>,
    @InjectModel(Table.name) private readonly tableModel: Model<Table>,
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    private jwtService: JwtService,
    private mailerService: MailerService
  ) {
    super(userModel);
    this.jwtService = new JwtService({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRE }
    });
  }

  async createUser(dto: RegisterUserDTO): Promise<User> {
    if (await this.userModel.findOne({ email: dto.email }).exec()) {
      throw new Error('Email already exists');
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(dto.password, salt);

    const createdUser = new this.userModel({
      ...dto,
      password: hash
    });
    await createdUser.save();
    this.sendVerificationEmail(createdUser.email);
    const createdWorkspace = new this.workspaceModel({
      name: 'New Workspace',
      owner: createdUser._id
    });
    await createdWorkspace.save();

    const createdTable = new this.tableModel({
      name: 'New Table',
      workspace: createdWorkspace._id
    });
    await createdTable.save();

    const createdTask = new this.taskModel({
      name: 'New Task',
      table: createdTable._id
    });
    await createdTask.save();

    createdWorkspace.tables = [createdTable._id];
    await createdWorkspace.save();

    createdTable.tasks = [createdTask._id];
    await createdTable.save();

    createdUser.workspaces = [createdWorkspace._id];
    await createdUser.save();
    return createdUser;
  }
  async sendVerificationEmail(email: string) {
    const token = await this.jwtService.signAsync({ email });
    const url = `${process.env.BASE_URL}/auth/verify-email?token=${token}`;
    const logoUrl = 'https://cdn.monday.com/images/logos/monday_logo_icon.png';

    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify your email',
      template: './verify-email',
      context: {
        url,
        logoUrl
      }
    });
  }
  async verifyEmail(email: string) {
    await this.userModel.updateOne({ email }, { verify: true });
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email: email }).exec();
    return user;
  }

  async getUserWorkspaces(id: string): Promise<Workspace[]> {
    const userId = new mongoose.Types.ObjectId(id);
    const workspaces = await this.workspaceModel.find({ owner: userId }).exec();
    return workspaces;
  }
}
