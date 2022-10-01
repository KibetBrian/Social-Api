import { model, Schema, Model, Document } from "mongoose";

interface IUser extends Document {
    userName: string
    email: string
    bio: string
    password: string
    followers: []
    following: []
    profilePicture: string
}

const UserSchema: Schema = new Schema(
    {
        userName:
        {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        bio:
        {
            type: String
        },
        password:
        {
            type: String,
            required: true
        },
        profilePicture:
        {
            type: String
        },
        coverPicture:
        {
            type: String
        },
        following:
        {
            type: Array,
        },
        followers:
        {
            type: Array
        },
        savedPosts:
        {
            type: Array
        }


    },
    { timestamps: true }
);

export const User = model<IUser>('user', UserSchema);