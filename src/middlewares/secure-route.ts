import jwt from "jsonwebtoken";
import { AuthenticationError } from "@/errors/http-errors";
import { type NextFunction, type Request, type Response } from "express";

const secureRoute = (req: Request, _res: Response, next: NextFunction) => {
	const token = req.cookies?.token;
	const accessSecret = process.env.ACCESS_TOKEN_SECRET;

	if (!token) {
		return next(new AuthenticationError("Authentication required"));
	}

	if (!accessSecret) {
		return next(new Error("ACCESS_TOKEN_SECRET is not configured"));
	}

	try {
		const payload = jwt.verify(token, accessSecret);

		if (
			typeof payload !== "object" ||
			typeof payload.userId !== "string" ||
			payload.userId.length === 0
		) {
			return next(new AuthenticationError("Invalid access token"));
		}

		return next();
	} catch {
		return next(new AuthenticationError("Invalid or expired access token"));
	}
};

export { secureRoute };
