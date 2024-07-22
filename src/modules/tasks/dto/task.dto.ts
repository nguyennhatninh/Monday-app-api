import { StatusTask } from '../../../global/globalEnum';

export class InfoCreateTaskDto {
  name: string;
  date: Date;
  status: StatusTask;
  table: string;
}

export class InfoUpdateTaskDto {
  name?: string;
  date?: Date;
  status?: StatusTask;
}
