import express, {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res:Response, next:NextFunction)=>{
    const headers = req.headers.authorization;
    const accessToken = headers?.split(' ')[1];
    try{
        const decoded = jwt.verify(accessToken as string, process.env.JWT_SECRET_KEY as string);
        req.body.user= decoded;
    }catch(err)
    {
        res.status(401).json('Unauthorized')
    }
    next();
}