import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { UserModule } from '../users/user.module';
import { Workspace, WorkspaceSchema } from '../../schemas/workspace.schema';
import { Table, TableSchema } from '../../schemas/table.shema';
import { Task, TaskSchema } from '../../schemas/task.schema';
import { User, UserSchema } from '../../schemas/user.schema';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Workspace.name, schema: WorkspaceSchema },
      { name: Table.name, schema: TableSchema },
      { name: Task.name, schema: TaskSchema }
    ])
  ],
  providers: [WorkspaceService, JwtService],
  controllers: [WorkspaceController],
  exports: [WorkspaceService]
})
export class WorkspaceModule {}
