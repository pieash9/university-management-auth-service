/* eslint-disable no-unused-vars */
import { Model, Types } from "mongoose";
import { IStudent } from "../student/student.interface";
import { IFaculty } from "../faculty/faculty.interface";
import { IAdmin } from "../admin/admin.interface";

export type IUser = {
  id: string;
  role: string;
  password: string;
  needsPasswordChange: true | false;
  student?: Types.ObjectId | IStudent;
  faculty?: Types.ObjectId | IFaculty;
  admin?: Types.ObjectId | IAdmin;
};

export interface UserModel extends Model<IUser> {
  isUserExist(
    id: string,
  ): Promise<Pick<IUser, "id" | "password" | "needsPasswordChange" | "role">>;

  isPasswordMatch(
    givenPassword: string,
    savePassword: string,
  ): Promise<boolean>;
}

// export interface IUserMethods {
//   isUserExist(id: string): Promise<Partial<IUser> | null>;
//   isPasswordMatch(
//     givenPassword: string,
//     savePassword: string,
//   ): Promise<boolean>;
// }

// export type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;
