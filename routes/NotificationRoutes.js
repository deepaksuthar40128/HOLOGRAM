import Express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import userNotify from "../models/userNotify.js";
import Users from "../models/Users.js";
import genError from "../utils/genError.js";
import Posts from "../models/Posts.js";
import timeago from "timeago.js";
import notifications from "../models/notifications.js"
const app = Express();

app.get('/getUserNotify', verifyUser, async (req, res, next) => {
    try {
        let data = await userNotify.findOne({ email: req.user.email });
        res.status(200).json(data);
    } catch (err) {
        next(genError(500, "Server Error!!"));
    }
})

app.post('/taskCompleteThanks', verifyUser, async (req, res, next) => {
    try {
        let user = await Users.findOne({ email: req.body.email });
        if (!user) {
            return next(genError(400, "No User Exist With This Email!"));
        }
        if (user.email === req.user.email) {
            return next(genError(400, "You Can't Thanks yourself!"));
        }
        await Posts.findByIdAndDelete(req.body.postId);
        await userNotify.findOneAndUpdate({ email: req.body.email }, {
            "IsNotification": true,
        })
        await (new notifications({
            email: 'admin@hologram.com',
            toemail: req.body.email,
            text: 'You got 10 points for helping!',
            link: `/profile/${req.body.email}`
        })).save();
        await Users.findByIdAndUpdate(user._id, { points: user.points + 10 });
        res.status(200).json({ "success": true });
    } catch (err) {
        next(genError(500, "Server Error!!"));
    }
})

app.get('/getNotifications', verifyUser, async (req, res, next) => {
    try {
        let data = await notifications.aggregate([
            {
                '$match': {
                    'toemail': req.user.email
                }
            }, {
                '$sort': {
                    'createdAt': -1
                }
            }
        ])
        data = await Promise.all(data.map(async key => {
            let user = (await Users.findOne({ email: key.email }))._doc;
            return {
                ...key,
                "createdAt": timeago.format(key.createdAt),
                "img": user.img,
                "username": user.username
            }
        }))
        await userNotify.findOneAndUpdate({ email: req.user.email }, { IsNotification: false });
        res.status(200).json(data);
    } catch (err) {
        next(genError(500, "Server Error!!"));
    }
})

app.get('/updateReadNotification/:id', verifyUser, async (req, res, next) => {
    try {
        await notifications.findByIdAndUpdate(req.params.id, { readed: true });
        res.status(200).json({ success: true });
    } catch (err) {
        next(genError(500, "Server Error!!"));
    }
})

export default app;