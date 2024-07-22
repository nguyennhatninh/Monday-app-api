import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from 'src/global/globalEnum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop({ default: Role.USER })
  roles: Role[];

  @Prop()
  email: string;

  @Prop({ default: false })
  verify: boolean;

  @Prop()
  password: string;

  @Prop()
  avatar: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Workspace' }] })
  workspaces: Types.ObjectId[];

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
