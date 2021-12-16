import { Router, Request, Response} from "express";
import { verifyToken } from "../middlewares";
import { Post } from "../models/post";
import { User } from "../models/user";
const postRoute = Router();

//Create a post
postRoute.post('/create', verifyToken, async (req: Request, res: Response) => {
    const { user, ...rest } = req.body;
    try {
        const post = new Post(rest);
        if (user._id === rest.userId) {
            await post.save();
            res.status(200).json('Post created');
        } else {
            res.status(401).json('You are not authorized');
        }

    } catch (err) {
        res.status(500).json('err');
    }
});

//Edit a post
postRoute.put('/update', verifyToken, async (req: Request, res: Response) => {
    const { user, ...rest } = req.body;
    try {
        const post = await Post.findById(rest.postId);
        if (user._id === post?.userId) {
            await Post.findByIdAndUpdate(rest.postId, rest, { new: true });
            res.status(200).json('Post updated');
        } else {
            res.status(401).json('Unauthorized');
        }
    } catch (err) {
        console.log(err);
        res.status(500).json('Error');
    }
});

//Delete post
postRoute.delete('/delete', verifyToken, async (req: Request, res: Response) => {
    const { user, ...rest } = req.body;
    try {
        const post = await Post.findById(rest.postId);
        if (post?.userId === user._id) {
            await Post.findOneAndDelete(rest.postId);
            res.status(200).json('Post deleted');
        } else {
            res.status(500).json('You are not authorized');
        }
    } catch (err) {
        console.log(err);
        res.status(500).json('Error');
    }
});

//Get a post
postRoute.get('/find', async (req: Request, res: Response) => {
    const desc = req.body.description;
    const regex = new RegExp(desc, 'i');
    try {
        const results = await Post.find({ description: { $regex: regex } });
        res.status(200).json(results);
    } catch (err) {
        console.log(err);
        res.status(500).json('Error');
    }
});

//Get users timeline
postRoute.get('/timeline', async (req: Request, res: Response) => {

    const timeLinePosts = [];
    const userId = req.body.userId;
    const usersPost = await Post.find({ userId: userId });
    timeLinePosts.push(usersPost);
    const user = await User.findById(userId);
    const userFollowing = user?.following;
    
    //Loop through each user following, request their posts and push to timeline posts
    for (let i: number = 0; i < userFollowing!.length; i++) {
        const eachUserPosts = await Post.find({ userId: userFollowing![i] });
        if (eachUserPosts.length > 0) {
            timeLinePosts.push(eachUserPosts);
        }
    }
    console.log(timeLinePosts);

    try {
        res.status(200).json(timeLinePosts);
    } catch (err) {
        console.log(err);
        res.status(500).json('Error');
    }
});


export default postRoute;