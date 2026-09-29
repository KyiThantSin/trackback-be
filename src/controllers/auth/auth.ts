import * as authService from '@/services/auth/auth';
import { BadRequestError } from '@/utils/errors';
import { type NextFunction, type Request, type Response } from 'express';

// adapter pattern
const login = async (req:Request, res:Response, next: NextFunction ) => {
    try{
        const {email, password, rememberMe} = req.body;

        if (
            email.trim().length === 0 ||
            password.length === 0 ||
            (rememberMe !== undefined && typeof rememberMe !== 'boolean')
        ) {
            throw new BadRequestError('Email and password are required');
        }

        const result = await authService.login({
            email: email.trim(),
            password,
            rememberMe,
        });
        res.status(200).json(result);
    }catch(error){
        next(error)
    }
};

export {
    login
};