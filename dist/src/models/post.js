"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const PostSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    likes: {
        type: Array
    },
    comments: {
        type: Array
    },
    shares: {
        type: Number
    }
}, { timestamps: true });
exports.Post = (0, mongoose_1.model)('post', PostSchema);
