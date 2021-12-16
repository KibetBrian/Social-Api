import { model, Schema, Model, Document } from "mongoose";

interface post extends Document {
    userId: string
    description: String
    image: String
    likes: []
    comments: []
    shares: number
}

const PostSchema: Schema =new Schema({
    userId:
    {
        type: String,
        required: true
    },
    description: 
    {
        type: String
    },
    image: 
    {
        type: String
    },
    likes:
    {
        type: Array
    },
    comments:
    {
        type: Array
    },
    shares: {
        type: Number
    }

}, {timestamps:  true});

export const Post: Model<post> = model('post', PostSchema);

