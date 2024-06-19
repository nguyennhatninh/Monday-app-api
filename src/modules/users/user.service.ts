import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InfoRegisterDto } from '../../dto/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
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
    const createdUser = await new this.userModel({
      ...infoRegisterDto,
      password: hash
    });
    await createdUser.save();
    this.sendVerificationEmail(createdUser.email);
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
    return this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }
  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email: email }).exec();
    if (user) {
      user.id = user._id.toString();
    }
    return user;
  }
  async getAll(): Promise<User[]> {
    const userArr = await this.userModel.find().exec();
    return userArr;
  }
  async getUser(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    return user;
  }
}
