import { Router, Request, Response} from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { verifyToken } from "../middlewares";
import { User } from "../models/user";
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
    console.log('This is user', user)
    if(!user)
    {
        res.status(404).json({message: 'user not found'})
    }else{

        const hash = user!.password;
        try {
            const result = bcrypt.compareSync(password, hash);
            if (result) {
                const jwt_obj = {
                    _id: user?._id,
                    userName: user?.userName,
                    email: user?.email
                }
                const accessToken = jwt.sign(jwt_obj, process.env.JWT_SECRET_KEY as string, { expiresIn: '3days' });
                res.status(200).json({jwt:accessToken, user: user});
            }
        } catch (err) {
            res.status(500).json('Error');
        }
    }

});

//Update user
userRoute.put('/update', verifyToken, async (req: Request, res: Response) => {
    const userObj = req.body.user;
    const { user, ...rest } = req.body;
    try {
        const user = await User.findOneAndUpdate({ _id: userObj._id }, rest, { new: true });
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json('Error');
    }
});

//Delete user
userRoute.delete('/delete', verifyToken, async (req: Request, res: Response) => {
    const userObj = req.body.user;
    try {
        const deleted = await User.findByIdAndDelete(userObj._id);
        res.status(200).json(deleted);
    } catch (err) {
        res.status(500).json('Error');
    }
});

//Find user
userRoute.get('/find', async (req: Request, res: Response) => {
    const params = req.body.username;
    const regex = new RegExp(params, 'i');
    try {
        const results = await User.find({ userName: { $regex: regex } });
        res.status(200).json(results);
    }
    catch (err) {
        res.status(500).json('Error');
    }
});

//Follow a user
userRoute.put('/follow', verifyToken, async (req: Request, res: Response) => {
    const { user, ...rest } = req.body;
    const toFollowId = rest.toFollowId;
    const u = await User.findById(user._id);
    let followed: boolean = false;

    //Check in the following id user is already followed
    for (let i = 0; i < u!.following.length; i++) {
        if (u!.following[i] === toFollowId) {
            followed = true;
        }
    }

    try {
        if (toFollowId !== user._id && !followed) {
            await User.updateOne({ _id: user._id }, { $push: { following: toFollowId } });
            res.status(200).json(`Followed ${toFollowId}`);
        } else if (toFollowId == user._id) {
            res.status(403).json('You cannot follow yourself')
        } else {
            res.status(403).json('User already followed');
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json('Err');
    }
})

export default userRoute;