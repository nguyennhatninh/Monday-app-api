import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { UserLoginRes } from 'src/interface/user.interface';
import { InfoLoginDto } from 'src/dto/user.dto';
import { User } from 'src/schemas/user.shema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

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
    if (!bcrypt.compareSync(infoLoginDto.password, user.password)) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.name, role: user.roles };
    return {
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
}
