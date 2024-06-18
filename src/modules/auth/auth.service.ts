import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { UserLoginRes } from 'src/interface/user.interface';
import { InfoLoginDto } from 'src/dto/user.dto';
import { User } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { firebaseAdmin } from 'src/firebase/firebase.config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private userService: UserService,
    private jwtService: JwtService
  ) {
    this.jwtService = new JwtService({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRE }
    });
  }

  async login(infoLoginDto: InfoLoginDto): Promise<UserLoginRes> {
    const user = await this.userService.findByEmail(infoLoginDto.email);
    if (!user) {
      throw new Error('Email not exist');
    }
    if (!bcrypt.compareSync(infoLoginDto.password, user.password)) {
      throw new Error('Password mismatch');
    }
    const payload = { id: user.id, username: user.name, role: user.roles };
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
    const user = await this.userService.findByEmail(email);
    if (!user) {
      const createdUser = await new this.userModel({
        email,
        name,
        verify: true,
        avatar: picture.replace('=s96-c', '=s384-c')
      });
      await createdUser.save();
      return {
        access_token: await this.jwtService.signAsync({ sub: createdUser.id, username: createdUser.name, role: ['user'] })
      };
    }
    const payload = { id: user.id, username: user.name, role: user.roles };
    return {
      userInfo: user,
      access_token: await this.jwtService.signAsync(payload)
    };
  }
}
