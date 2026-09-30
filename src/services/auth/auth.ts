import type { LoginPayload, RegisterPayload, User } from "@/types/user";
import * as userRespository from "@/repositories/userRepository";
import { AuthenticationError, ConflictError } from "@/utils/errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (payload: LoginPayload) => {
  const user = await userRespository.findByEmail(payload.email);
  if (!user) {
    throw new AuthenticationError("Invalid email or password");
  }

  const isValid = await bcrypt.compare(payload.password, user.password);
  if (!isValid) {
    throw new AuthenticationError("Invalid email or password");
  }

  const accessSecret = process.env.ACCESS_TOKEN_SECRET;

  if (!accessSecret) {
    throw new Error("ACCESS_TOKEN_SECRET is not configured");
  }

  const accessToken = jwt.sign(
    {
      userId: user.id,
    },
    accessSecret,
    { expiresIn: payload.rememberMe ? "30d" : "1d" },
  );

  const userInfo: User = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    deletedAt: user.deletedAt,
  };

  return { accessToken, userInfo };
};

const register = async (data: RegisterPayload) => {
  const user = await userRespository.findByEmail(data.email);

  if (user) {
    throw new ConflictError("User already exists");
  }

  const createdUser = await userRespository.createUser({
    name: data.name,
    email: data.email,
    password: await bcrypt.hash(data.password, 10),
    role: data.role,
  });

  const userInfo: User = {
    id: createdUser.id,
    name: createdUser.name,
    email: createdUser.email,
    role: createdUser.role,
    createdAt: createdUser.createdAt,
    updatedAt: createdUser.updatedAt,
    deletedAt: createdUser.deletedAt,
  };

  return userInfo;
};

export { login, register };
