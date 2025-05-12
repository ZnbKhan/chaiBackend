import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// configuartion
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"})); //form data
app.use(express.urlencoded({extended:true, limit:"16kb"})) //url data 
app.use(express.static("public")); //server assets rkhne k liye
app.use(cookieParser()) // server se user ka brwoser acess kr pau ar set kr pau CRUD



export {app};