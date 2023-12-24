import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { User } from "../user/user.model";
import { ILoginUser } from "./auth.interface";

const loginUser = async (payload: ILoginUser) => {
  const { id, password } = payload;

  // check user exist
  //   const user = new User();
  //   const isUserExist =await user.isUserExist(id);

  const isUserExist = await User.isUserExist(id);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist!");
  }

  // match password
  if (
    isUserExist?.password &&
    !(await User.isPasswordMatch(password, isUserExist?.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password is incorrect.");
  }

  //   create access toke n

  return;
};

export const AuthService = {
  loginUser,
};
