import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// configuartion
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

// middlewares
app.use(express.json({limit:"16kb"})); //form data
app.use(express.urlencoded({extended:true, limit:"16kb"})) //url data 
app.use(express.static("public")); //server assets rkhne k liye
app.use(cookieParser()) // server se user ka brwoser acess kr pau ar set kr pau CRUD

// routes import
import userRouter from './routes/user.routes.js'
import videoRouter from './routes/video.routes.js'
import playlistRouter from './routes/playlist.routes.js'
import tweetRouter from './routes/tweet.route.js'

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/users/video", videoRouter)
app.use("/api/v1/user/playlist", playlistRouter)
app.use("/api/v1/user/tweet", tweetRouter)

// http://localhost/api/v1/users/register
export {app};