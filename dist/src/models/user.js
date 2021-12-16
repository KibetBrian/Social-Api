"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    bio: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String
    },
    following: {
        type: Array,
    },
    followers: {
        type: Array
    }
}, { timestamps: true });
exports.User = (0, mongoose_1.model)('user', UserSchema);
