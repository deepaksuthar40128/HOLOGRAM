import mongoose from "mongoose";
const key = new mongoose.Schema(
    {
        email: String,
        key: String
    },
    { timestamps: true }
);

export default mongoose.model("Key", key);
