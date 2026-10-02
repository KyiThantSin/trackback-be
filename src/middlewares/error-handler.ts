import { AppError } from '@/utils/errors';
import { type NextFunction, type Request, type Response } from 'express';

export const errorHandler = (
    error:Error,
    req:Request,
    res:Response,
    next:NextFunction
) => {
    if(error instanceof AppError){
        return res.status(error.statusCode).json({
            status: 'error',
            code: error.code,
            message: error.message
        })
    }

    console.error('Unhandled Error:', error);
    return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    })
}