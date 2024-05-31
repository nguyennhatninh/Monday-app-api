import { Injectable } from '@nestjs/common';
import { User } from 'src/interface/user.interface';

@Injectable()
export class UserService {
  login(userInfo): User {
    return userInfo;
  }
}
