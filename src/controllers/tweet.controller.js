import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    // content from req.body
    // already user login hai then cokkie se user info then save in db

    try {
        const {content}  = req.body;
        if(!content){
            throw new ApiError(400, "write a tweet please before posting")
        }
    
        const userId = req.user._id;
        if(!userId){
            throw new ApiError(400, "Please Login to post twweet")
        }
    
         const user = await User.findById(userId);
    
         const tweet = await Tweet.create({
            content,
            user
         })
    
         return res.status(200).json(new ApiResponse(200, tweet, "Tweet is created sucesfully"))
    
    } catch (error) {
       return res.status(500).json(new ApiResponse(500, "Server Error while creating tweet"))
        
    }
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
