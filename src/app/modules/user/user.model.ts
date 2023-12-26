/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import config from '../../../config';

const UserSchema = new Schema<IUser, UserModel>(
  {
    id: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    password: { type: String, required: true, select: 0 },
    needsPasswordChange: { type: Boolean, default: true },
    passwordChangedAt: { type: Date },
    student: { type: Schema.Types.ObjectId, ref: 'Student' },
    faculty: { type: Schema.Types.ObjectId, ref: 'Faculty' },
    admin: { type: Schema.Types.ObjectId, ref: 'Admin' },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

// UserSchema.methods.isUserExist = async function (
//   id: string,
// ): Promise<Partial<IUser> | null> {
//   return await User.findOne(
//     { id },
//     { id: 1, password: 1, needsPasswordChange: 1 },
//   );
// };

// UserSchema.methods.isPasswordMatch = async function (
//   givenPassword: string,
//   savePassword: string,
// ): Promise<boolean> {
//   return await bcrypt.compareSync(givenPassword, savePassword);
// };

UserSchema.statics.isUserExist = async function (
  id: string,
): Promise<Pick<
  IUser,
  'id' | 'password' | 'needsPasswordChange' | 'role'
> | null> {
  return await User.findOne(
    { id },
    { id: 1, password: 1, role: 1, needsPasswordChange: 1 },
  );
};

UserSchema.statics.isPasswordMatch = async function (
  givenPassword: string,
  savePassword: string,
): Promise<boolean> {
  return await bcrypt.compareSync(givenPassword, savePassword);
};

//  user.save() er khtre kaj krbe
UserSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hashSync(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );

  if (!user.needsPasswordChange) {
    user.passwordChangedAt = new Date();
  }
  next();
});

export const User = model<IUser, UserModel>('User', UserSchema);
