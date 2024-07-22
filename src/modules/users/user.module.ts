import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserSchema } from '../../schemas/user.schema';
import { Workspace, WorkspaceSchema } from '../../schemas/workspace.schema';
import { Table, TableSchema } from '../../schemas/table.shema';
import { Task, TaskSchema } from '../../schemas/task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Workspace.name, schema: WorkspaceSchema },
      { name: Table.name, schema: TableSchema },
      { name: Task.name, schema: TaskSchema }
    ])
  ],
  controllers: [UserController],
  providers: [UserService, JwtService],
  exports: [UserService]
})
export class UserModule {}
