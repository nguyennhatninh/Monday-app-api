import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { firebaseAdmin } from '../../firebase/firebase.config';
import { UserLoginRes } from '../../interface/user.interface';
import { InfoLoginDto } from '../users/dto/user.dto';
import { User, UserDocument } from '../../schemas/user.schema';
import { Workspace, WorkspaceDocument } from '../../schemas/workspace.schema';
import { Table, TableDocument } from '../../schemas/table.shema';
import { Task, TaskDocument } from '../../schemas/task.schema';
import { MailerService } from '@nestjs-modules/mailer';
import { TokenResetPasswordDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Workspace.name) private workspaceModel: Model<WorkspaceDocument>,
    @InjectModel(Table.name) private tableModel: Model<TableDocument>,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    private userService: UserService,
    private mailerService: MailerService,
    private jwtService: JwtService
  ) {
    this.jwtService = new JwtService({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRE }
    });
  }

  async login(infoLoginDto: InfoLoginDto): Promise<UserLoginRes> {
    const user = await this.userModel.findOne({ email: infoLoginDto.email }).exec();
    if (!user) {
      throw new Error('Email not exist');
    }
    if (!bcrypt.compareSync(infoLoginDto.password, user.password)) {
      throw new Error('Password mismatch');
    }
    const payload = { _id: user._id, username: user.name, role: user.roles };
    return {
      userInfo: user,
      access_token: await this.jwtService.signAsync(payload)
    };
  }
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (user && user.verify && user.password === password) {
      return user;
    }
    return null;
  }

  async verifyGoogleToken(idToken: string) {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    const { email, name, picture } = decodedToken;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      const createdUser = await new this.userModel({
        email,
        name,
        verify: true,
        avatar: picture.replace('=s96-c', '=s384-c')
      });
      await createdUser.save();
      const createdWorkspace = new this.workspaceModel({
        name: 'New Workspace',
        owner: createdUser._id
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

      createdUser.workspaces = [createdWorkspace._id];
      await createdUser.save();
      return {
        userInfo: createdUser,
        access_token: await this.jwtService.signAsync({ id: createdUser._id, username: createdUser.name, role: ['user'] })
      };
    }
    const payload = { id: user._id, username: user.name, role: user.roles };
    return {
      userInfo: user,
      access_token: await this.jwtService.signAsync(payload)
    };
  }

  async sendResetLink(email: string) {
    const user = await this.userModel.findOne({ email: email }).exec();
    if (!user) {
      throw new Error('User not found');
    }

    const token = await this.jwtService.signAsync({ id: user._id });

    const resetLink = `${process.env.URL_CLIENT}/resetPassword/${token}`;
    const logoUrl = 'https://cdn.monday.com/images/logos/monday_logo_icon.png';

    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset Link',
      template: './reset-password',
      context: {
        resetLink,
        logoUrl
      }
    });

    return { message: 'Reset link sent to email' };
  }

  async resetPassword(token: string, newPassword: string) {
    const payload: TokenResetPasswordDto = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET
    });

    const user = await this.userModel.findById(payload.id).exec();
    const userId = user._id.toString();
    if (!user) {
      throw new Error('Invalid token');
    }

    await this.userService.update(userId, { password: newPassword });

    return { message: 'Password reset successfully' };
  }
}
