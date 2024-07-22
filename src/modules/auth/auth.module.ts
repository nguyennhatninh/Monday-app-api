import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../users/user.module';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../schemas/user.schema';
import { Workspace, WorkspaceSchema } from '../../schemas/workspace.schema';
import { Table, TableSchema } from '../../schemas/table.shema';
import { Task, TaskSchema } from '../../schemas/task.schema';

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
  providers: [AuthService, JwtService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
