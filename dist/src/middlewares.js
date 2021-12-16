"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const headers = req.headers.authorization;
    const accessToken = headers === null || headers === void 0 ? void 0 : headers.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET_KEY);
        req.body.user = decoded;
    }
    catch (err) {
        res.status(401).json('Unauthorized');
    }
    next();
};
exports.verifyToken = verifyToken;
