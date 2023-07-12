import Express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import Users from "../models/Users.js";
import genError from "../utils/genError.js";
import dotenv from "dotenv"
import { compressAndOverwrite, upload } from "../utils/imageCompresser.js";
dotenv.config({ path: ".env" });
const app = Express();

app.get('/User/:email', verifyUser, async (req, res, next) => {
    try {
        let user = await Users.findOne({ email: req.params.email });
        if (!user) return next(genError(400, "No User found!"));
        res.status(200).json(user);
    } catch (err) {
        next(genError(500, "Server Error!!"));
    }
})

app.post('/updateBio', verifyUser, async (req, res, next) => {
    try {
        let data = await Users.findOneAndUpdate({ email: req.user.email }, req.body, { new: true });
        res.status(200).json(data._doc);
    } catch (err) {
        next(genError(500, "Server Error!!"));
    }
})

app.post('/updateProfileImg', verifyUser, upload.single('file'), (req, res, next) => compressAndOverwrite(req, res, next, 100, false, 100, 100, 0), async (req, res, next) => {
    try {
        let data = await Users.findOneAndUpdate({ email: req.user.email }, { img: req.file.location }, { new: true });
        res.status(200).json(data._doc);
    } catch (err) {
        next(genError(500, "Server Error!!"));
    }
})


app.post('/updateBGImg', verifyUser, upload.single('file'), (req, res, next) => compressAndOverwrite(req, res, next, 100, false, 300, 1000, 0), async (req, res, next) => {
    try {
        let data = await Users.findOneAndUpdate({ email: req.user.email }, { bg: req.file.location }, { new: true });
        res.status(200).json(data._doc);
    } catch (err) {
        next(genError(500, "Server Error!!"));
    }
})

app.get('/search', async (req, res, next) => {
    try {
        let searchText = req.query.q;
        if (searchText !== '') {
            let data = await Users.aggregate([
                {
                    $match: {
                        $or: [
                            {
                                "username": new RegExp(searchText, 'i')
                            },
                            {
                                "email": new RegExp(searchText, 'i')
                            }
                        ]
                    }
                }, {
                    $project: {
                        "username": 1,
                        "img": 1,
                        "email": 1
                    }
                }, {
                    $limit: 10
                }
            ]).exec();
            res.status(200).json(data);
        }
        else {
            res.status(200).json([])
        }
    } catch (err) {
        next(genError(500, "Server Error!"));
    }
})

export default app;