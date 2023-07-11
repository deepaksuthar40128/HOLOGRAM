import mongoose from "mongoose";
const post = new mongoose.Schema(
    {
        email: {
            type: String,
        },
        photo: {
            type: String,
        },
        text: {
            type: String,
        },
        tags: {
            type: Array,
        },
        location: {
            type: Array,
        },
        likes: {
            type: Array,
        }
    },
    { timestamps: true }
);

export default mongoose.model("Post", post);
