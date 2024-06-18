import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../users/user.module';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [UserModule, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [AuthService, JwtService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
