import mongoose from "mongoose";
const Schema = mongoose.Schema;
const comment = new mongoose.Schema(
    {
        postId: {
            type: Schema.Types.ObjectId,
            ref: "Post"
        },
        comments: [{
            user: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            text: String,
            time: Date,
        }]
    }
);

export default mongoose.model("Comment", comment);
