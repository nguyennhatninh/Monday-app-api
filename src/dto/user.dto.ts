import { Role } from 'src/global/globalEnum';

export class InfoLoginDto {
  email: string;
  password: string;
}

export class InfoRegisterDto {
  name: string;
  email: string;
  password: string;
  roles?: Role[];
}

export class InfoUpdatedDto {
  name?: string;
  email?: string;
  password?: string;
  roles?: Role[];
}
