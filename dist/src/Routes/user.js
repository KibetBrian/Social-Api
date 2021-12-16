"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoute = (0, express_1.Router)();
userRoute.get('/register', async (req, res) => {
    res.status(200).json('This is user');
});
exports.default = userRoute;
