import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';

export type TokenDocument = HydratedDocument<Token>;

@Schema()
export class Token {
  @ApiProperty({
    name: 'token',
    type: String
  })
  @IsNotEmpty()
  @IsString()
  @Prop()
  token: string;

  @ApiProperty({
    name: 'userId',
    type: String
  })
  @IsNotEmpty()
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @ApiProperty({
    name: 'createdAt',
    type: Date
  })
  @IsNotEmpty()
  @IsDate()
  @Prop({ default: Date.now, expires: '7d' })
  createdAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
