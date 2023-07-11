import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
        },
        email: {
            type: String,
        },
        country: {
            type: String,
        },
        img: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        area: {
            type: String,
        },
        phone: {
            type: String,
        },
        password: {
            type: String,
        },
        isAdmin: {
            type: Boolean,
        },
        bg: {
            type: String,
        },
        bio: {
            type: String,
        },
        pincode: {
            type: String,
        },
        level: {
            type: Number,
        },
        points: {
            type: Number,
        }
    },
    { timestamps: true }
);

export default mongoose.model("User", UserSchema);
