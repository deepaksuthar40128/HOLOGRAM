import Express from "express";
import dotenv from "dotenv"
dotenv.config({ path: ".env" });
import timeago from "timeago.js"
import { verifyUser } from "../utils/verifyUser.js";
import Posts from "../models/Posts.js";
import Users from "../models/Users.js";
import fetch from "node-fetch";
import genError from "../utils/genError.js";
import comments from "../models/comments.js";
import { compressAndOverwrite, upload } from "../utils/imageCompresser.js";

const app = Express();

app.post('/feedPost', verifyUser, upload.single('file'), (req, res, next) => compressAndOverwrite(req, res, next, 100, true, 100, 100, 500), async (req, res, next) => {
    let tags = req.body.tags.split('/');
    let user = await Users.findById(req.user._id);
    let location = [];
    if (req.body.defaultLocation) {
        location = [
            user.country,
            user.city,
            user.pincode,
            user.state,
            "World"
        ]
        if (user.area !== '') location.push(user.area);
    }
    else location = (req.body.location).split(',');
    let newPost = {
        "email": req.user.email,
        "photo": req.file.location,
        "text": req.body.text,
        "tags": tags,
        "location": location
    }
    try {
        newPost = new Posts(newPost);
        newPost = await newPost.save();
        res.status(200).json(newPost);
    }
    catch (err) {
        next(genError(500, "Server Error!!"));
    }
})

app.get('/allPost', verifyUser, async (req, res, next) => {
    try {
        let posts = await Posts.aggregate([
            {
                $match: {
                    "tags": {
                        $elemMatch: {
                            $eq: req.query.tag || '',
                        }
                    },
                    "location": {
                        $elemMatch: {
                            $eq: req.query.location || 'World',
                        }
                    }
                }
            },
            {
                $sort: {
                    createdAt: -1,
                }
            },
            {
                $skip: parseInt(req.query.count) - 1
            },
            {
                $limit: 1
            }
        ])
        posts = await Promise.all(posts.map(async post => {
            let user = await Users.findOne({ email: post.email });
            let allComments = await comments.findOne({ postId: post._id });
            return {
                ...post,
                "photo": post.photo,
                "createdAt": timeago.format(post.createdAt),
                "userprofile": user.img,
                "username": user.username,
                "likes": post.likes ? post.likes.length : 0,
                "user_like": post.likes ? post.likes.includes(req.user._id) : false,
                "comments": allComments ? allComments._doc.comments.length : 0,
            }
        }))
        res.status(200).json(posts);
    } catch (err) {
        next(genError(500, "Server Error!!"));
    }
})


app.get('/posts/:email', verifyUser, async (req, res, next) => {
    try {
        let user = await Users.findOne({ email: req.params.email });
        if (!user) return next(genError(404, "No User Found!!"));
        let posts = await Posts.aggregate([
            {
                '$match': {
                    'email': req.params.email
                }
            }, {
                '$sort': {
                    'createdAt': -1
                }
            }
        ])
        posts = await Promise.all(posts.map(async post => {
            let allComments = await comments.findOne({ postId: post._id });
            return {
                ...post,
                "photo": post.photo,
                "createdAt": timeago.format(post.createdAt),
                "userprofile": user.img,
                "username": user.username,
                "likes": post.likes ? post.likes.length : 0,
                "user_like": post.likes ? post.likes.includes(req.user._id) : false,
                "comments": allComments ? allComments._doc.comments.length : 0,
            }
        }))
        res.status(200).json(posts);
    } catch (err) {
        next(genError(500, "Server Error!!"));
    }
})

app.get('/deletePost/:id', verifyUser, async (req, res, next) => {
    try {
        let Post = await Posts.findById(req.params.id);
        if (!Post) {
            return next(genError(404, "No Post Found!!"));
        }
        else {
            if (Post.email === req.user.email) {
                await comments.deleteMany({ postId: req.params.id });
                await Posts.findByIdAndDelete(req.params.id);
                res.status(200).json({ success: true });
            } else {
                return next(genError(404, "You can Only Delete Your Post!!"));
            }
        }
    } catch (err) {
        next(genError(500, "Server Error!!"));
    }
})

app.post('/fetchApis', (req, res, next) => {
    fetch(req.body.url).then(response => response.json()).then(data => {
        res.status(200).json(data)
    }).catch(error => {
        next(genError(500, "Server Error!!"))
    });
})


app.get('/like/:id', verifyUser, async (req, res) => {
    try {
        let post = await Posts.findById(req.params.id);
        post = post._doc;
        let likes = post.likes;
        if (likes.includes(req.user._id)) {
            await Posts.findByIdAndUpdate(req.params.id, {
                $pull: {
                    'likes': {
                        $eq: req.user._id,
                    }
                }
            })
        }
        else {
            let newPost = await Posts.findByIdAndUpdate(req.params.id, {
                $push: {
                    'likes': req.user._id,
                }
            }, { new: true })
            res.json(newPost);
        }
    } catch (err) {
        console.log(err);
    }
})


app.post('/addComment/:id', verifyUser, async (req, res) => {
    let data = await comments.findOne({ postId: req.params.id });
    if (data) {
        let data2 = await comments.findByIdAndUpdate(data._id, {
            $push: {
                comments: {
                    user: req.user._id,
                    text: req.body.comment,
                    time: new Date(),
                }
            }
        }, { new: true })
        res.json(data2);
    } else {
        let data2 = await (new comments({
            postId: req.params.id,
            comments: [{
                user: req.user._id,
                text: req.body.comment,
                time: new Date(),
            }]
        })).save();
        res.json(data2);
    }
})

app.get('/comments/:id', verifyUser, async (req, res) => {
    try {
        let data = await comments.findOne({ postId: req.params.id }).populate('comments.user');
        if (data) {
            let allComments = data._doc.comments;
            allComments = allComments.map(comment => {
                comment = comment._doc;
                return {
                    ...comment,
                    user: {
                        "username": comment.user.username,
                        "userProfile": comment.user.img,
                        "email": comment.user.email,
                    },
                    time: timeago.format(comment.time),
                }
            })
            console.log(allComments);
            res.status(200).json(allComments);
        } else {
            res.status(200).json([]);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


export default app;
