import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { LoginDTO } from './dto';
import { firebaseAdmin } from '../../firebase';
import { User, UserDocument } from '../../schemas/user.schema';
import { Workspace, WorkspaceDocument } from '../../schemas/workspace.schema';
import { Table, TableDocument } from '../../schemas/table.shema';
import { Task, TaskDocument } from '../../schemas/task.schema';
import { Token, TokenDocument } from '../../schemas/token.schema';
import { Role } from '../../common/enum';

interface JWTInfo {
  _id: Types.ObjectId;
  username: string;
  role: Role;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    @InjectModel(Workspace.name) private workspaceModel: Model<WorkspaceDocument>,
    @InjectModel(Table.name) private tableModel: Model<TableDocument>,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    private mailerService: MailerService,
    private jwtService: JwtService
  ) {
    this.jwtService = new JwtService({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
    });
  }

  async login(dto: LoginDTO) {
    const user = await this.userModel.findOne({ email: dto.email }).exec();
    if (!user) {
      throw new Error('Email not exist');
    }
    if (!bcrypt.compareSync(dto.password, user.password)) {
      throw new Error('Password mismatch');
    }
    const payload = { _id: user._id, username: user.name, role: user.roles };
    return this.generateUserToken(payload);
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
      const payload = { _id: createdUser._id, username: createdUser.name, role: Role.USER };
      return this.generateUserToken(payload);
    }
    const payload = { _id: user._id, username: user.name, role: user.roles };
    return this.generateUserToken(payload);
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

    return 'Reset link sent to email';
  }

  async refreshToken(refreshToken: string) {
    const token = await this.tokenModel.findOne({ token: refreshToken }).exec();
    if (!token) {
      throw new UnauthorizedException();
    }
    const userInfo = await this.jwtService.verifyAsync(token.token, {
      secret: process.env.REFRESH_TOKEN_SECRET
    });
    const payload = { _id: userInfo._id, username: userInfo.username, role: userInfo.role };
    const userToken = await this.generateUserToken(payload);
    await this.deleteToken(token.token);
    return userToken;
  }

  async generateUserToken(payload: JWTInfo) {
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE
    });

    await new this.tokenModel({ token: refreshToken, userId: payload._id }).save();
    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: refreshToken
    };
  }
  async deleteToken(token: string) {
    await this.tokenModel.deleteOne({ token: token }).exec();
  }

  async resetPassword(token: string, newPassword: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.ACCESS_TOKEN_SECRET
    });

    const user = await this.userModel.findById(payload.id).exec();
    const userId = user._id.toString();
    if (!user) {
      throw new Error('Invalid token');
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(newPassword, salt);
    await this.userModel.findByIdAndUpdate(userId, {
      password: hash
    });

    return 'Password reset successfully';
  }
}
