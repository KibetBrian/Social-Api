import { Router, Request, Response } from "express";
import bcrypt from 'bcrypt';
import { verifyToken } from "../middlewares";
import { User } from "../models/user";
import { HashPassword } from '../utils/utils';

const userRoute = Router();

userRoute.post("/register", async (req: Request, res: Response) => {
    const { userName, email, password } = req.body
    const inValid = userName === undefined || email == undefined || password == undefined

    if (inValid) {
        res.status(403).json("enter username, email and password")
        return
    }

    //Hash user password
    const hashedPassword = await HashPassword(password)

    try {

        let exist = await User.findOne({ userName })
        if (exist) {
            res.status(409).json({ message: "username already taken" })
            return
        }
        exist = await User.findOne({ email })
        if (exist) {
            res.status(403).json({ message: "email already taken" })
            return
        }

        const user = new User({ userName, email, password: hashedPassword });
        const savedUser: any = await user.save()
        const { password, ...rest } = savedUser._doc;

        res.status(200).json({ "userData": rest })

    } catch (e) {

        res.status(500).json({ message: "error occured during registration", e })
    }
});

userRoute.put('/update', verifyToken, async (req: Request, res: Response) => {
    const userObj = req.body.user;
    const { user, ...rest } = req.body;

    try {
        const user = await User.findOneAndUpdate({ _id: userObj._id }, rest, { new: true });
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json('Error occured while updating user');
    }

});

userRoute.delete('/delete', verifyToken, async (req: Request, res: Response) => {
    const userObj = req.body.user;

    try {
        const deleted = await User.findByIdAndDelete(userObj._id);

        res.status(200).json(deleted);
    } catch (err) {
        res.status(500).json('Error deleting user');
    }

});

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

userRoute.put('/follow', verifyToken, async (req: Request, res: Response) => {
    const { user, ...rest } = req.body;
    const toFollowId = rest.toFollowId;
    const u = await User.findById(user._id);

    if (toFollowId == user._id) {
        res.status(403).json('You cannot follow yourself')
        return;
    }
    if (!u) {
        res.status(404).json('User not found');
        return;
    }

    let followed: boolean = false;

    for (let i = 0; i < u.following.length; i++) {
        if (u.following[i] === toFollowId) {
            followed = true;
        }
    }
    try {
        if (!followed) {
            await User.updateOne({ _id: user._id }, { $push: { following: toFollowId } });
            res.status(200).json("User followed");
            return
        }
        await User.updateOne({ _id: user._id }, { $pull: { following: toFollowId } });
        res.status(403).json('User unfollowed');
    }
    catch (err) {
        res.status(500).json('Error while updating following preference');
    }
})

export default userRoute;