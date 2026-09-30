import { BadRequestError } from "@/utils/errors";
import { type NextFunction, type Request, type Response } from "express";
import * as userService from "@/services/users/users";

const getUser = async (req:Request, res:Response, next:NextFunction) => {
    try{
        const userId = req.params.id;

        if(typeof userId !== 'string' || userId.length === 0){
            throw new BadRequestError('User ID is required');
        }
        
        const response = await userService.getUser(userId);
        return res.status(200).json(response);
    }catch(error){
        return next(error)
    }
}

export {
    getUser
}