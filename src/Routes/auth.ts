import { Router, Request, Response } from 'express';
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
        res.status(200).json({
            success: true,
            message: "Auth successful",
            user: req.user
        })
    }
});

authRoute.get('/logout', (req, res) => {
    res.redirect(clientHomePage);
});

authRoute.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
authRoute.get('/google/callback', passport.authenticate('google', { successRedirect: clientHomePage, failureRedirect: failedClientUrl }), (req, res) => {
    console.log('Callback')
    res.redirect(clientHomePage);
});


export default authRoute;
