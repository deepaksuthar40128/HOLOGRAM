import Express from "express";
import Users from "../models/Users.js";
import bcrypt from "bcrypt"
import Jwt from "jsonwebtoken";
import genError from "../utils/genError.js";
import userNotify from "../models/userNotify.js";
import { verifyUser } from "../utils/verifyUser.js";
import key from "../models/key.js";
import { resetPasswordEmail, verifyEmail } from "../utils/sendMail.js";
import token from "../models/token.js"
import dotenv from "dotenv"
dotenv.config({ path: ".env" });
const app = Express();


app.post('/login', async (req, res, next) => {
    try {
        let user = await Users.findOne({ email: req.body.email });
        if (!user) {
            next(genError(400, "user Not Exist"));
        }
        else {
            user = user._doc;
            if (await bcrypt.compare(req.body.password, user.password)) {
                const { _id, password, ...user_data } = user;
                const email = user.email;
                let Token = Jwt.sign({ "_id": _id, "password": password, "email": email }, process.env.JWT);
                res.cookie("access_token", Token).status(200).json(user_data);
            } else {
                next(genError(400, "Password or Username is Wrong"));
            }
        }
    } catch (err) {
        console.log(err);
        next(genError(500, "Server Error!!"));
    }
})



app.post('/register', async (req, res, next) => {
    let data = await Users.findOne({ email: req.body.email });
    if (data) return next(genError(400, "User Already Exist"));
    try {
        let hash = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));
        let user_data = { ...req.body, "password": hash, "level": 1, "points": 0 };
        let user = new Users(user_data);
        user = await user.save();
        await (new userNotify({ "email": user.email })).save();
        res.status(200).json(user);
    } catch (err) {
        next(genError(500, "Server Error!!"));
    }
})

app.post('/verifyKey', async (req, res, next) => {
    try {
        let data = await key.findOne({ key: req.body.key });
        if (!data) {
            return next(genError(400, "No Data Found!!"));
        }
        console.log(data);
        let user = await Users.findOne({ email: data.email });
        user = user._doc;
        const { _id, password, ...user_data } = user;
        const email = user.email;
        let Token = Jwt.sign({ "_id": _id, "password": password, "email": email }, process.env.JWT);
        res.cookie("access_token", Token).status(200).json(user_data);
    } catch (err) {
        console.log(err);
        next(genError(500, "Server Error!!"));
    }
})

app.post('/addKey', verifyUser, async (req, res, next) => {
    try {
        let duplicateKey = await key.findOne({ email: req.user.email });
        if (duplicateKey) return next(genError(400, "A key already Exist!"));
        let data = await (new key({ email: req.user.email, key: req.body.key })).save();
        res.status(200).json(data);
    } catch (err) {
        next(genError(500, "Server Error!!"));
    }
})


app.post('/sendOTP', async (req, res, next) => {
    try {
        let user = await Users.findOne({ email: req.body.email });
        if (!user) return next(genError(400, "No Account Exist!!"));
        let OTP = Math.ceil(1000 + Math.random() * 8999);
        await resetPasswordEmail(req.body.email, OTP);
        let data = await (new token({
            otp: OTP,
            email: req.body.email
        })).save();
        res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        next(genError(500, "Server Error!!"));
    }
})


app.post('/verifyOTP', async (req, res, next) => {
    try {
        let otps = await token.find({ email: req.body.email });
        if (!otps) return next(genError(400, "OTP Wrong or Expired!"));
        let ismatch = false;
        otps.map(otp => {
            if (otp.otp == req.body.otp) {
                ismatch = true;
            }
        })
        if (!ismatch)
            return next(genError(400, "Wrong OTP"));
        res.status(200).json({ ismatch });
    } catch (err) {
        next(genError(500, "Server Error!!"));
    }
})


app.post('/newPassword', async (req, res, next) => {
    try {
        let user = await Users.findOneAndUpdate({ email: req.body.email }, { password: await bcrypt.hash(req.body.password, await bcrypt.genSalt(10)) });
        res.status(200).json({ success: true });
    } catch (err) {
        next(genError(500, "Server Error!!"));
    }
})

app.post('/verifyEmail', async (req, res, next) => {
    try {
        let user = await Users.findOne({ email: req.body.email });
        if (user) return next(genError(400, "Already Account Exist!!"));
        let OTP = Math.ceil(1000 + Math.random() * 8999);
        await verifyEmail(req.body.email, OTP);
        let data = await (new token({
            otp: OTP,
            email: req.body.email
        })).save();
        res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        next(genError(500, "Server Error!!"));
    }
})

export default app;