import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { InfoRegisterDto } from './dto/user.dto';
import { User } from '../../schemas/user.schema';
import { Workspace } from '../../schemas/workspace.schema';
import { Table } from '../../schemas/table.shema';
import { Task } from '../../schemas/task.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Workspace.name) private workspaceModel: Model<Workspace>,
    @InjectModel(Table.name) private readonly tableModel: Model<Table>,
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    private jwtService: JwtService,
    private mailerService: MailerService
  ) {
    this.jwtService = new JwtService({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRE }
    });
  }

  async create(infoRegisterDto: InfoRegisterDto): Promise<User> {
    if (await this.userModel.findOne({ email: infoRegisterDto.email }).exec()) {
      throw new Error('Email already exists');
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(infoRegisterDto.password, salt);

    const createdUser = new this.userModel({
      ...infoRegisterDto,
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
  async update(id: string, updateData: Partial<User>): Promise<User> {
    if (updateData.password) {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(updateData.password, salt);
      updateData.password = hash;
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    console.log(updatedUser);
    return updatedUser;
  }
  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email: email }).exec();
    return user;
  }
  async getAll(): Promise<User[]> {
    const userArr = await this.userModel.find().exec();
    return userArr;
  }
  async getUser(id: string): Promise<User> {
    const userId = new mongoose.Types.ObjectId(id);
    const user = await this.userModel.findById(userId);
    return user;
  }
  async getUserWorkspaces(id: string): Promise<Workspace[]> {
    const userId = new mongoose.Types.ObjectId(id);
    const workspaces = await this.workspaceModel.find({ owner: userId }).exec();
    return workspaces;
  }
}
