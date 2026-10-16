import type { LoginPayload, RegisterPayload, User } from "@/types/user";
import * as userRespository from "@/repositories/userRepository";
import { AuthenticationError, ConflictError, NotFoundError } from "@/errors/http-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "@/integrations/email/emailService";

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
    profileUrl: user.profileUrl,
    profilePublicId: user.profilePublicId,
    role: user.role as User["role"],
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
    role: data.role ?? "user",
  });

  const userInfo: User = {
    id: createdUser.id,
    name: createdUser.name,
    email: createdUser.email,
    profileUrl: createdUser.profileUrl,
    profilePublicId: createdUser.profilePublicId,
    role: createdUser.role as User["role"],
    createdAt: createdUser.createdAt,
    updatedAt: createdUser.updatedAt,
    deletedAt: createdUser.deletedAt,
  };

  return userInfo;
};

const forgotPassword = async (email: string) => {
  const user = await userRespository.findByEmail(email);

  if(!user){
    throw new NotFoundError("Account has not been created with this email")
  }

  const resetSecret = process.env.RESET_PASSWORD_SECRET;
  const frontendUrl = process.env.CORS_ORIGIN;

  if (!resetSecret || !frontendUrl) {
    throw new Error("RESET_PASSWORD_SECRET and FRONTEND_URL must be configured");
  }

  const resetToken = jwt.sign(
    { userId: user.id, type: "password-reset" },
    resetSecret,
    { expiresIn: "15m" },
  );
  
  // front-end page route
  const resetUrl = new URL("/auth/reset-password", frontendUrl);
  resetUrl.searchParams.set("token", resetToken);

  await sendEmail({
    receiverEmail: user.email,
    recipientName: user.name,
    type: "FORGOT",
    url: resetUrl.toString(),
  });

  return {
    resetToken,
    resetUrl: resetUrl.toString(),
  };
};

const resetPassword = async (token: string, password: string) => {
  const resetSecret = process.env.RESET_PASSWORD_SECRET;
  const frontendUrl = process.env.CORS_ORIGIN;

  if (!resetSecret || !frontendUrl) {
    throw new Error("RESET_PASSWORD_SECRET and FRONTEND_URL must be configured");
  }

  let payload: string | jwt.JwtPayload;
  try {
    payload = jwt.verify(token, resetSecret);
  } catch {
    throw new AuthenticationError("Reset link is invalid or expired");
  }

  if (
    typeof payload === "string" ||
    payload.type !== "password-reset" ||
    typeof payload.userId !== "string"
  ) {
    throw new AuthenticationError("Reset link is invalid or expired");
  }

  const user = await userRespository.findById(payload.userId);
  if (!user) {
    throw new AuthenticationError("Reset link is invalid or expired");
  }

  await userRespository.updateUser({
    userId: user.id,
    updates: { password: await bcrypt.hash(password, 10) },
  });

  // strategy pattern + factory pattern
  await sendEmail({
    receiverEmail: user.email,
    recipientName: user.name,
    type: "RESET",
    url: new URL("/auth/login", frontendUrl).toString(), // login page route
  });

};

export { login, register, forgotPassword, resetPassword };
