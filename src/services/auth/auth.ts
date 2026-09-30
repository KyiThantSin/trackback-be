import type { LoginPayload, RegisterPayload, User } from "@/types/user";
import * as userRespository from "@/repositories/userRepository";
import { AuthenticationError, ConflictError } from "@/utils/errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createHash } from "node:crypto";

const login = async (data: LoginPayload) => {
  const user = await userRespository.findByEmail(data.email);
  if (!user) {
    throw new AuthenticationError("Invalid email or password");
  }

  const isValid = await bcrypt.compare(data.password, user.password);
  if (!isValid) {
    throw new AuthenticationError("Invalid email or password");
  }

  const accessSecret = process.env.ACCESS_TOKEN_SECRET;
  const refreshSecret = data.rememberMe
    ? process.env.REFRESH_TOKEN_SECRET
    : undefined;

  if (!accessSecret || (data.rememberMe && !refreshSecret)) {
    throw new Error("JWT secrets are not configured");
  }

  const refreshToken = data.rememberMe
    ? jwt.sign(
        {
          userId: user.id,
        },
        refreshSecret!,
        { expiresIn: "30d" },
      )
    : undefined;

  // update refresh token
  if (refreshToken) {
    await userRespository.updateRefreshTokenHash({
      userId: user.id,
      tokenHash: createHash("sha256").update(refreshToken).digest("hex"),
    });
  }

  const accessToken = jwt.sign(
    {
      userId: user.id,
    },
    accessSecret,
    { expiresIn: "1d" },
  );

  const userInfo: User = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };

  return { refreshToken, accessToken, userInfo };
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
  };

  return userInfo;
};

const logout = async (refreshToken: string) => {
  await userRespository.clearRefreshTokenHash(
    createHash("sha256").update(refreshToken).digest("hex"),
  );
};

export { login, register, logout };
