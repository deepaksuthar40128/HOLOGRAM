import mongoose from "mongoose";
const msz = new mongoose.Schema(
    {
        Fromemail: {
            type: String,
        },
        Toemail: {
            type: String,
        },
        text: {
            type: String,
        },
        Post_id: {
            type: String,
        },
        readed:
        {
            type: Boolean,
        }
    },
    { timestamps: true }
);

export default mongoose.model("Msz", msz);
