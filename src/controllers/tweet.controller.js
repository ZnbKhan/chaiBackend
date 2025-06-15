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

        const {content}  = req.body;
        if(!content){
            throw new ApiError(400, "write a tweet before posting")
        }
    
        const userId = req.user._id;
        if(!userId){
            throw new ApiError(400, "Please Login to post twweet")
        }
    
         const user = await User.findById(userId);
        //  console.log(user)
    
         const tweet = await Tweet.create({
            content,
            owner: user._id
         })
    
         return res.status(200).json(new ApiResponse(200, tweet, "Tweet is created sucesfully"))
    
    
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    // have user info via req.user._id
    // display all the tweets

    const userId = req.user._id;
    if(!userId){
        throw new ApiError(400, "User is not login login first")
    }


     const user = await User.findById(userId);

     if(!user){
        throw new ApiError(400, "User not found")
     }

     const tweets = await Tweet.find({owner:userId}).select("-owner")

     return res.status(200).json(new ApiResponse(200, tweets, "Fetched Tweets Sucessfully"));

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params;
    // console.log("tweetId: ", tweetId)
    const {content} = req.body;
    // console.log("Content: ", content);
    const userId = req.user._id;
    // console.log("userId: ", userId)

  if (!tweetId || !content) {
    throw new ApiError(400, "Tweet ID and updated content are required");
  }
   
    const tweet = await Tweet.findOne({_id:tweetId, owner:userId })
    // console.log("tweet: ", tweet)

    if (!tweet) {
    throw new ApiError(404, "Tweet not found or you're not authorized to update it");
    }

    tweet.content = content;
    await tweet.save();

    return res.status(200).json(new ApiResponse(200, tweet, "tweet updated sucessfully"))

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params;
    const userId = req.user._id;

     if(!tweetId){
        throw new ApiError(400, "provide tweet id")
     }
    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if(tweet.owner.toString() !== userId.toString()){
     throw new ApiError(403, "You are not authorized to delete this tweet");

  }

  await tweet.deleteOne();

return res.status(200).json(new ApiResponse(200, {}, "Tweet is deleted sucesfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
