import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from './user-role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })  // ✅ agrega createdAt, updatedAt automáticamente
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  rut: string;

  @Prop({ enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ default: true })
  isActive: boolean;  // ✅ marca si está activo o no
}

export const UserSchema = SchemaFactory.createForClass(User);
