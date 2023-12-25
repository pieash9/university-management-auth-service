import bcrypt from "bcrypt";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { User } from "../user/user.model";
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from "./auth.interface";
import { JwtPayload, Secret } from "jsonwebtoken";
import config from "../../../config";
import { JwtHelper } from "../../../helpers/jwtHelper";

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
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

  //   create access token & refresh token
  const { id: userId, role, needsPasswordChange } = isUserExist;
  const accessToken = JwtHelper.createToken(
    {
      userId,
      role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = JwtHelper.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return { accessToken, refreshToken, needsPasswordChange };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  //  verify token
  let verifiedToken = null;
  try {
    verifiedToken = JwtHelper.verifyToken(
      token,
      config.jwt.refresh_secret as Secret,
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid refresh token.");
  }

  const { userId } = verifiedToken;

  // checking deleted user refresh token
  const isUserExist = await User.isUserExist(userId);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist.");
  }

  // generate new token
  const newAccessToken = JwtHelper.createToken(
    { id: isUserExist?.id, role: isUserExist?.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );
  return { accessToken: newAccessToken };
};

const changePassword = async (
  user: JwtPayload | null,
  payload: IChangePassword,
): Promise<void> => {
  const { oldPassword, newPassword } = payload;
  console.log(user);

  // checking is user exist
  const isUserExist = await User.isUserExist(user?.userId);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist!");
  }

  // checking old password
  if (
    isUserExist?.password &&
    !(await User.isPasswordMatch(oldPassword, isUserExist?.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Old Password is incorrect.");
  }

  // hash password before saving
  const newHashPassword = await bcrypt.hashSync(
    newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  // update password
  const updatedData = {
    password: newHashPassword,
    needsPasswordChange: false,
    passwordChangedAt: new Date(),
  };

  await User.findOneAndUpdate({ id: user?.userId }, updatedData);
};

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
};
