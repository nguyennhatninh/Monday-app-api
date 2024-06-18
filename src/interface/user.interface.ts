import { User } from 'src/modules/users/schemas/user.schema';

export interface UserLoginRes {
  userInfo: User;
  access_token: string;
}
