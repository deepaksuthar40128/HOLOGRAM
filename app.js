import Express from "express";
import AuthRoutes from "./routes/AuthRoutes.js";
import PostRoutes from "./routes/PostRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";
import ChatRoutes from "./routes/ChatRoutes.js";
import NotificationRoutes from "./routes/NotificationRoutes.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path"
import dotenv from "dotenv"
dotenv.config({ path: ".env" });
const app = Express();
app.use(Express.json());
app.use(cookieParser()); 
const connect = async () => {
    await mongoose.connect(process.env.MONGO_URL,
        {
            useNewUrlParser: true, useUnifiedTopology: true, 
        });
    console.log("connected to database");
}
connect();

app.use('/api/auth', AuthRoutes);
app.use('/api/post', PostRoutes);
app.use('/api/user', UserRoutes);
app.use('/api/chat', ChatRoutes);
app.use('/api/notification', NotificationRoutes);


app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    })
})

if (process.env.NODE_ENV === "production") {
    app.use(Express.static(path.resolve(path.resolve(), 'client', 'build')));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(path.resolve(), 'client', 'build', 'index.html'), function (err) {
            if (err) {
                res.status(500).send(err)
            }
        });
    })
}

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
    console.log(`connected on of ${PORT}`);
})