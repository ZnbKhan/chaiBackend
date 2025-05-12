// require('dotenv').config({path:'./env'})
import dotenv from 'dotenv'

import connectDB from "./db/db.js";

dotenv.config({
    path: './env'
})



connectDB()





































/*
import express from 'express';
const app = express();

//iify
(async()=>{
    try {
       await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        app.on("error", (err)=>{
            console.log("ERROR: ", err);
            throw err;
        })

        app.listen(process.env.PORT, ()=>{
            console.log(`App is listening on port ${process.env.PORT}`)
        })
        
    } catch (error) {
        console.error("ERROR: ", error);
        throw error
    }
})();
*/