import { User } from 'src/schemas/user.schema';

export interface UserLoginRes {
  userInfo: User;
  access_token: string;
}
