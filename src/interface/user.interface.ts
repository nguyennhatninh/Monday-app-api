import { User } from 'src/schemas/user.shema';

export interface UserLoginRes {
  userInfo: User;
  access_token: string;
}
