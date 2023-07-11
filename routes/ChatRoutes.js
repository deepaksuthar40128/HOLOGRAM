import Express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import chat from "../models/chat.js"
import Users from "../models/Users.js";
import timeago from "timeago.js";
import userNotify from "../models/userNotify.js";
import genError from "../utils/genError.js";
import notifications from "../models/notifications.js"
import Posts from "../models/Posts.js";
import comments from "../models/comments.js";
const app = Express();

app.get('/getUsers', verifyUser, async (req, res, next) => {
    try {
        let data = await chat.aggregate([
            {
                $match: {
                    $or: [
                        {
                            Toemail: req.user.email,
                        }, {
                            Fromemail: req.user.email,
                        }
                    ]
                },
            }, {
                $sort: {
                    createdAt: -1
                }
            },
        ])
        let newData = [];
        let uniqueEmails = new Set();
        data.forEach(key => {
            let email = key.Fromemail === req.user.email ? key.Toemail : key.Fromemail;
            if (!uniqueEmails.has(email)) {
                uniqueEmails.add(email);
                newData.push({
                    "email": email,
                    "createdAt": key.createdAt,
                    "readed": key.readed,
                    "_id": key._id
                })
            }
        })
        newData = await Promise.all(newData.map(async key => {
            let user = await Users.findOne({ email: key.email });
            return {
                ...key,
                "username": user.username,
                "userprofile": user.img,
                "createdAt": timeago.format(key.createdAt),
            }
        }))
        await userNotify.findOneAndUpdate({ email: req.user.email }, {
            "Ismessage": false,
        })
        res.status(200).json(newData);
    } catch (err) {
        next(genError(500, "Server Error!!"));
    }
})


app.post('/sharePost', verifyUser, async (req, res, next) => {
    try {
        let user = await Users.findOne({ email: req.body.email });
        if (!user) {
            return next(genError(400, "No User Exist With This Email!"));
        }
        if (user.email === req.user.email) {
            return next(genError(400, "You Can't share it with yourself!"));
        }
        await userNotify.findOneAndUpdate({ email: req.body.email }, {
            "IsNotification": true,
            "Ismessage": true,
        })
        await (new notifications({
            email: req.user.email,
            toemail: user.email,
            text: 'shared a post with You',
            link: `/chat#${req.user.email}`
        })).save();
        let newMsz = new chat({
            Fromemail: req.user.email,
            Toemail: req.body.email,
            Post_id: req.body.postId,
            text: req.body.text,
            readed: false
        })
        let data = await newMsz.save();
        res.status(200).json(data);
    } catch (err) {
        next(genError(500, "Server Error!!"));
    }
})

app.get('/chatdata/:email', verifyUser, async (req, res, next) => {
    try {
        let data = await chat.aggregate([
            {
                '$match': {
                    $or: [
                        {
                            'Fromemail': req.user.email,
                            'Toemail': req.params.email
                        },
                        {
                            'Fromemail': req.params.email,
                            'Toemail': req.user.email
                        }
                    ]
                }
            },
            {
                '$sort': {
                    'createdAt': 1
                }
            }
        ]
        )
        data = data.map(key => (
            {
                ...key,
                "createdAt": timeago.format(key.createdAt)
            }
        ))
        res.status(200).json(data);
    } catch (err) {
        next(genError(500, "Server Error!!"));
    }
})


app.get('/sharedPost/:id', verifyUser, async (req, res, next) => {
    try {
        let data = await Posts.findById(req.params.id);
        if (!data) return next(genError(404, "Post Not Found!!"));
        data = data._doc;
        let postUser = await Users.findOne({ email: data.email });
        postUser = postUser._doc;
        let allComments = await comments.findOne({ postId: data._id });
        data = {
            ...data,
            "photo": data.photo,
            "createdAt": timeago.format(data.createdAt),
            "userprofile": postUser.img,
            "username": postUser.username,
            "likes": data.likes?data.likes.length:0,
            "user_like": data.likes?data.likes.includes(req.user._id):false,
            "comments": allComments ? allComments._doc.comments.length : 0
        }
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        next(genError(500, "Server Error!!"));
    }
})


app.get('/markMszRead/:id', verifyUser, async (req, res, next) => {
    try{
    let msz = await chat.findById(req.params.id);
    if (msz.Fromemail !== req.user.email) {
        await chat.findByIdAndUpdate(req.params.id, { readed: true });
    }
        res.status(200).json({success:true});
    }catch(err){
        next(genError(500,"Server Error!"));
             }
})


app.post('/sendMsz', verifyUser, async (req, res, next) => {
    try {
        await (new chat({
            Fromemail: req.user.email,
            Toemail: req.body.email,
            text: req.body.msz,
            readed: false
        })).save();
        await userNotify.findOneAndUpdate({ email: req.body.email }, {
            "IsNotification": true,
            "Ismessage": true,
        })
        await (new notifications({
            email: req.user.email,
            toemail: req.body.email,
            text: 'Send a message',
            link: `/chat#${req.user.email}`
        })).save();
        res.status(200).json({ success: true });
    } catch (err) {
        next(genError(500, "Server Error!!"));
    }
})

export default app;
