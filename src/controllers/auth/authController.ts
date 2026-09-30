import * as authService from "@/services/auth/auth";
import { BadRequestError } from "@/utils/errors";
import { type NextFunction, type Request, type Response } from "express";

// adapter pattern
const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (
      email.trim().length === 0 ||
      password.length === 0 ||
      (rememberMe !== undefined && typeof rememberMe !== "boolean")
    ) {
      throw new BadRequestError("Email and password are required");
    }

    const response = await authService.login({
      email: email.trim(),
      password,
      rememberMe,
    });
    
    res.cookie("token", response.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      data: response,
      message: "Login Successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;

    if (
      name.length === 0 ||
      email.trim().length === 0 ||
      password.length === 0
    ) {
      throw new BadRequestError("Name, email, password, and role are required");
    }

    const response = await authService.register({
      name: name,
      email: email.trim(),
      password,
      role: role,
    });
    return res.status(201).json({ data: response, message: "Register Successfully" });
  } catch (error) {
    return next(error);
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return next(error);
  }
};

export { login, register, logout };
