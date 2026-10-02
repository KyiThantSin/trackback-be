// Base custome error extends native JS error
export abstract class AppError extends Error{
    public abstract readonly statusCode: number;
    public readonly code?: string;
    
    constructor(message: string, code?: string) {
        super(message)
        this.code = code;
        Object.setPrototypeOf(this, new.target.prototype)
        Error.captureStackTrace(this, this.constructor)
    }
}

export class ForbiddenError extends AppError {
    public readonly statusCode = 403;

    constructor(message = "Forbidden", code = "FORBIDDEN") {
        super(message, code);
    }
}

export class ClaimError extends AppError {
    public readonly statusCode: number;

    constructor(statusCode: number, code: string, message: string) {
        super(message, code);
        this.statusCode = statusCode;
    }
}

/* 400 Bad Request */
export class BadRequestError extends AppError{
    public readonly statusCode = 400;
    
    constructor(message:string = "Bad Request"){
        super(message)
    }
}

/* 404 Not Found */
export class NotFoundError extends AppError{
    public readonly statusCode = 404;

    constructor(message:string = "Resource Not Found"){
        super(message)
    }
}

/* 401 Not Authenticated */
export class AuthenticationError extends AppError{
    public readonly statusCode = 401;
    
    constructor(message:string = "Not Authenticated"){
        super(message)
    }
}

/* 409 conflict error */
export class ConflictError extends AppError{
    public readonly statusCode = 409; 

    constructor(message:string = "Conflict Occured"){
        super(message)
    }
}