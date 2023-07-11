import mongoose from "mongoose";

const token = new mongoose.Schema({
    otp: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: () => Date.now(),
    },
    expire_at: {
        type: Date,
        default: Date.now,
        expires: 300
    }
});

export default mongoose.model('token', token);