import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from '../common/enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @ApiProperty({
    name: 'name',
    type: String,
    description: 'The name of user'
  })
  @IsNotEmpty()
  @IsString()
  @Prop()
  name: string;

  @ApiProperty({
    name: 'roles',
    type: Array,
    description: 'The roles of user'
  })
  @IsNotEmpty()
  @Prop({ default: Role.USER })
  roles: Role;

  @ApiProperty({
    name: 'email',
    type: String,
    description: 'The email of user'
  })
  @IsNotEmpty()
  @IsString()
  @Prop()
  email: string;

  @ApiProperty({
    name: 'verify',
    type: Boolean,
    description: 'Verify email'
  })
  @IsNotEmpty()
  @IsBoolean()
  @Prop({ default: false })
  verify: boolean;

  @ApiProperty({
    name: 'password',
    type: String,
    description: 'Password of user'
  })
  @IsOptional()
  @IsString()
  @Prop()
  password: string;

  @ApiProperty({
    name: 'avatar',
    type: String,
    description: 'Avatar of user'
  })
  @IsOptional()
  @IsString()
  @Prop()
  avatar: string;

  @ApiProperty({
    name: 'workspaces',
    type: String,
    description: 'Workspaces of user'
  })
  @IsOptional()
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Workspace' }] })
  workspaces: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
