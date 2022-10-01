import { Router, Request, Response } from "express";
import { verifyToken } from "../middlewares";
import { Post } from "../models/post";
import { User } from "../models/user";
const postRoute = Router();

postRoute.post('/create', verifyToken, async (req: Request, res: Response) => {
    const { user, ...rest } = req.body;
    if (user) {
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
    } else {
        res.status(401).json('Invalid token');
    }
});

postRoute.put('/update', verifyToken, async (req: Request, res: Response) => {
    const { user, ...rest } = req.body;

    try {
        const post = await Post.findById(rest.postId);

        if (user._id === post?.userId) {
            await Post.findByIdAndUpdate(rest.postId, rest, { new: true });
            res.status(200).json('Post updated');
            return;
        }

        res.status(401).json('You are not authorized to perform this action');
    } catch (err) {
        res.status(500).json('Error occured while updating post');
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
            return;
        }

        res.status(500).json('You are not authorized');
    } catch (err) {
        res.status(500).json('Error occured while deleting post');
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

postRoute.put('/like', verifyToken, async (req: Request, res: Response) => {
    const { user, ...rest } = req.body;

    const postId = rest.postId;
    const userId = rest.userId;

    try {
        if (userId === user._id) {
            await Post.updateOne({ _id: postId }, { $push: { likes: userId } });
            res.status(200).json('Liked');
            return;
        }

         res.status(401).json("Unauthorized")
    }
    catch (err) {
        res.status(500).json('Error occured while perfoming like operation')
    }
});

postRoute.put('/comment', verifyToken, async (req: Request, res: Response) => {
    const { user, ...rest } = req.body;

    try {
        if (rest.userId === user._id) {
            await Post.updateOne({ _id: rest.postId }, { $push: { comments: { userId: user._id, comment: rest.comment } } });
            res.status(200).json('Comment posted')
            return;
        }
        res.status(401).json('Unauthorized');

    } catch (err) {
        res.status(500).json('Error occured while posting comment');
    }
})

postRoute.get('/timeline/:id', async (req: Request, res: Response) => {

    const timeLinePosts:any = [];
    const userId = req.params.id;
    const usersPost = await Post.find({ userId: userId });

    timeLinePosts.concat(usersPost);

    const user = await User.findById(userId);
    if (!user){
        res.status(404).json('User data not found');
        return;
    }
    const userFollowing = user.following;

    //Loop through each user following, request their posts and push to timeline posts
    for (let i: number = 0; i < userFollowing.length; i++) {
        const eachUsersPosts = await Post.find({ userId: userFollowing![i] });

        if (eachUsersPosts.length > 0) {
            timeLinePosts.concat(eachUsersPosts);
        }

    }

    res.status(200).json(timeLinePosts);
});

postRoute.put('/save', verifyToken, async (req: Request, res: Response) => {
    const { user, ...rest } = req.body;

    try {
        if (user._id === rest.userId) {
            await User.updateOne({ _id: user._id }, { $push: { savedPosts: rest.postId } });
            res.status(201).json('Post saved');
            return;
        }
        res.status(401).json('You are not allowed to perform this action');
    } catch (err) {
        res.status(500).json('Error occured while saving post');
    }
})



export default postRoute;