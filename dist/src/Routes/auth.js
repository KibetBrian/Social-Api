"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const authRoute = (0, express_1.Router)();
const clientHomePage = "http://localhost:3000/";
const failedClientUrl = "http://localhost:3000/auth/login/failed";
authRoute.get('/login/failed', (req, res) => {
    res.status(401).json({
        success: false,
        message: "Auth failed"
    });
});
authRoute.get('/login-success', (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: "Auth successful",
            user: req.user
        });
    }
});
authRoute.get('/logout', (req, res) => {
    req.logout();
    res.redirect(clientHomePage);
});
authRoute.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
authRoute.get('/google/callback', passport_1.default.authenticate('google', { successRedirect: clientHomePage, failureRedirect: failedClientUrl }), (req, res) => {
    console.log('Callback');
    res.redirect(clientHomePage);
});
exports.default = authRoute;
