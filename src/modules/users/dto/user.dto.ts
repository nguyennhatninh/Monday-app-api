import { Role } from '../../../global/globalEnum';

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

export class InfoRegisterGoogleDto {
  name: string;
  email: string;
}

export class InfoUpdatedDto {
  name?: string;
  email?: string;
  password?: string;
  roles?: Role[];
}
