import mongoose from "mongoose";
const notification = new mongoose.Schema(
    {
        "email": String,
        "toemail": String,
        "text": String,
        "link": String,
        "readed": Boolean,
    },
    { timestamps: true }
);

export default mongoose.model("Notification", notification);
