import { AppError } from '@/errors/http-errors';
import { type NextFunction, type Request, type Response } from 'express';
import multer from 'multer';

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

    if(error instanceof multer.MulterError){
        const message = error.code === 'LIMIT_FILE_SIZE'
            ? 'File is too large. Maximum size is 5MB.'
            : error.code === 'LIMIT_UNEXPECTED_FILE'
                ? 'Unexpected file field or too many files.'
                : error.message;
        return res.status(400).json({
            status: 'error',
            code: error.code,
            message
        })
    }

    console.error('Unhandled Error:', error);
    return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    })
}