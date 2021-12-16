import { Router, Request, Response, NextFunction } from "express";
import jwt, { sign } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from "../models/user";
import { nextTick } from "process";
const userRoute = Router();

//Register new user
userRoute.post('/register', async (req: Request, res: Response) => {
    const plainTextPassword = req.body.password;

    //Hash plain text password using bcrypt
    const saltRounds: number = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(plainTextPassword, salt);
    req.body.password = hash;

    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (e) {
        console.log(e);
        console.log(req.body)
        res.status(500).json('Error');
    }

});

//Login
userRoute.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    const hash = user!.password;
    try {
        console.log(user)
        const result = bcrypt.compareSync(password, hash);
        if (result) {
            const jwt_obj = {
                _id: user?._id,
                userName: user?.userName,
                email: user?.email
            }
            const accessToken = jwt.sign(jwt_obj, process.env.JWT_SECRET_KEY as string);
            res.status(200).json(accessToken);
        }
    } catch (err) {
        res.status(500).json('Error');
    }

});

//Find user
userRoute.get('/find', async (req: Request, res: Response) => {
    const params = req.body.username;
    console.log(params);
    const regex = new RegExp(params, 'i');
    try {
        const results = await User.find({ userName: { $regex: regex } });
        res.status(200).json(results);
    }
    catch (err) {
        res.status(500).json('Error');
    }
});


export default userRoute;