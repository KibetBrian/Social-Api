import { Router, Request, Response } from 'express';
import { User } from "../models/user";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import passport from 'passport';

const authRoute = Router();

const clientHomePage = "http://localhost:3000/"
const failedClientUrl = "http://localhost:3000/auth/login/failed"

authRoute.get('/login/failed', (req, res) => {
    res.status(401).json({
        success: false,
        message: "Auth failed"
    })
});

authRoute.get('/login-success', (req, res) => {
    if (req.user) {
        res.status(200).json({ message: "Auth successful",user: req.user})
    }
});

authRoute.get('/logout', (req, res) => {
    res.redirect(clientHomePage);
});

authRoute.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRoute.get('/google/callback', passport.authenticate('google', { successRedirect: clientHomePage, failureRedirect: failedClientUrl }), (req, res) => {
    res.redirect(clientHomePage);
});

//Login
authRoute.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (email === undefined || password === undefined) {
        res.status(403).json({message: "please enter email or password"});
        return;
    }
    
    const user: any = await User.findOne({ email: email });
    if (!user) {
        res.status(404).json({ message: 'user not found' });
        return;
    }

    const hash = user.password;
    try {
        const result = bcrypt.compareSync(password, hash);
        if (result) {
            const jwt_obj = { _id: user._id, userName: user.userName, email: user.email }
            
            const accessToken = jwt.sign(jwt_obj, process.env.JWT_SECRET_KEY as string, { expiresIn: '3days' });
            const des = { ...user }._doc;
            const userData = { ...des, jwt: accessToken }; 
            
            res.status(200).json(userData);
            return;        
        }

        res.status(403).json("Invalid email or password");
    } catch (err) {
        res.status(500).json('Error');
    }
}

);

export default authRoute;
