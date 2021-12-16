"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middlewares_1 = require("../middlewares");
const user_1 = require("../models/user");
const userRoute = (0, express_1.Router)();
//Register new user
userRoute.post('/register', async (req, res) => {
    const plainTextPassword = req.body.password;
    //Hash plain text password using bcrypt
    const saltRounds = 10;
    const salt = bcrypt_1.default.genSaltSync(saltRounds);
    const hash = bcrypt_1.default.hashSync(plainTextPassword, salt);
    req.body.password = hash;
    try {
        const user = new user_1.User(req.body);
        await user.save();
        res.status(201).json(user);
    }
    catch (e) {
        console.log(e);
        console.log(req.body);
        res.status(500).json('Error');
    }
});
//Login
userRoute.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await user_1.User.findOne({ email: email });
    const hash = user.password;
    try {
        console.log(user);
        const result = bcrypt_1.default.compareSync(password, hash);
        if (result) {
            const jwt_obj = {
                _id: user === null || user === void 0 ? void 0 : user._id,
                userName: user === null || user === void 0 ? void 0 : user.userName,
                email: user === null || user === void 0 ? void 0 : user.email
            };
            const accessToken = jsonwebtoken_1.default.sign(jwt_obj, process.env.JWT_SECRET_KEY, { expiresIn: '3days' });
            res.status(200).json(accessToken);
        }
    }
    catch (err) {
        res.status(500).json('Error');
    }
});
//Update user
userRoute.put('/update', middlewares_1.verifyToken, async (req, res) => {
    const userObj = req.body.user;
    const _a = req.body, { user } = _a, rest = __rest(_a, ["user"]);
    try {
        const user = await user_1.User.findOneAndUpdate({ _id: userObj._id }, rest, { new: true });
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json('Error');
    }
});
//Delete user
userRoute.delete('/delete', middlewares_1.verifyToken, async (req, res) => {
    const userObj = req.body.user;
    try {
        const deleted = await user_1.User.findByIdAndDelete(userObj._id);
        res.status(200).json(deleted);
    }
    catch (err) {
        res.status(500).json('Error');
    }
});
//Find user
userRoute.get('/find', async (req, res) => {
    const params = req.body.username;
    const regex = new RegExp(params, 'i');
    try {
        const results = await user_1.User.find({ userName: { $regex: regex } });
        res.status(200).json(results);
    }
    catch (err) {
        res.status(500).json('Error');
    }
});
//Follow a user
userRoute.put('/follow', middlewares_1.verifyToken, async (req, res) => {
    const _a = req.body, { user } = _a, rest = __rest(_a, ["user"]);
    const toFollowId = rest.toFollowId;
    const u = await user_1.User.findById(user._id);
    let followed = false;
    //Check in the following id user is already followed
    for (let i = 0; i < u.following.length; i++) {
        if (u.following[i] === toFollowId) {
            followed = true;
        }
    }
    try {
        if (toFollowId !== user._id && !followed) {
            await user_1.User.updateOne({ _id: user._id }, { $push: { following: toFollowId } });
            res.status(200).json(`Followed ${toFollowId}`);
        }
        else if (toFollowId == user._id) {
            res.status(403).json('You cannot follow yourself');
        }
        else {
            res.status(403).json('User already followed');
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json('Err');
    }
});
exports.default = userRoute;
