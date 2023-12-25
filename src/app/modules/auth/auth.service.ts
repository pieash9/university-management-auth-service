import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { User } from "../user/user.model";
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from "./auth.interface";
import { Secret } from "jsonwebtoken";
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

export const AuthService = {
  loginUser,
  refreshToken,
};
