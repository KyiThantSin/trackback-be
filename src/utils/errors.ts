// Base custome error extends native JS error
export abstract class AppError extends Error{
    public abstract readonly statusCode: number;
    
    constructor(message: string) {
        super(message)
        Object.setPrototypeOf(this, new.target.prototype)
        Error.captureStackTrace(this, this.constructor)
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

/* 403 Forbidden */
export class ForbiddenError extends AppError{
    public readonly statusCode = 403;

    constructor(message:string = "Forbidden"){
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