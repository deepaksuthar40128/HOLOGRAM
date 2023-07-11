import mongoose from "mongoose";
const notify = new mongoose.Schema(
    {
        "email": String,
        "Ismessage": Boolean,
        "IsNotification": Boolean
    },
    { timestamps: true }
);

export default mongoose.model("Notify", notify);
