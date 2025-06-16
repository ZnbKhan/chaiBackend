import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/likes.models.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.models.js"
import { Tweet } from "../models/tweet.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on video
    /**  
     * You're trying to toggle a like on a video — meaning:
    If the user has already liked the video, then remove the like.
    If the user has not liked the video yet, then add the like.
    * 
    we got user as user is already logged in 
    need to find video got videoId from req.params
    check id video is already liked
    if existing like then unlike it
    add the user and video in like model  
    * **/
    const {videoId} = req.params;
    const userId = req.user._id;

    if(!videoId){
        throw new ApiError(400, "videoId not found");
    }

    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(400, "Video not found");
    }

    const existingLike = await Like.findOne({
        video:videoId,
        likedBy:userId
    })

    if(existingLike){
        await existingLike.deleteOne();
        return res.status(200).json(new ApiResponse(200, {}, "Video Unliked Sucesfully"))
    }

    const newLike = await Like.create({
        video:videoId,
        likedBy:userId
    })
    return res.status(200).json(new ApiResponse(200, newLike, "video liked sucessfully"))

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on comment
    // got commentId and userId from req.params and req.user._id
    // check comment exist
    // if comment is liked then unlike
    // otherwise like and sabe

    const {commentId} = req.params;
    const userId = req.user._id;

    if(!commentId){
        throw new ApiError(400, "commentId is missing");
    }

    const comment =  await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(400, "Comment not found")
    }

    const existingComment = await Like.findOne({comment:commentId})

    if(existingComment){
        await existingComment.deleteOne();
        return res.status(200).json(new ApiResponse(200, {}, "Comment unliked Sucessfully"));
    }

    const newComment = await Like.create({
        likedBy:userId,
        comment:commentId,
    })

    return res.status(200).json(new ApiResponse(200, newComment, "liked comment sucesfully"))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on tweet
    
    const {tweetId} = req.params
    const userId = req.user._id;

    if(!tweetId){
        throw new ApiError(400, "Tweet Id not found");
    }

     const tweet =  await Tweet.findById(tweetId)
     console.log(tweet)
     if(!tweet){
        throw new ApiError(400, "Tweet Not found")
     }

     const existingTweetLike = await Like.findOne({
        tweet:tweetId,
        likedBy:userId
     })

     if(existingTweetLike){
        await existingTweetLike.deleteOne();
        return res.status(200).json(new ApiResponse(200, "unlike tweet sucessfully"))
     }

     const newTweetLike = await Like.create({
        tweet:tweetId,
        likedBy:userId,
     })

     return res.status(200).json(new ApiResponse(200, newTweetLike, "Tweet Liked Sucesfully"))
 })

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    // user is already loggedin get his/her all liked video
    // userId se populate kr lenge video bhi

    const userId = req.user._id;

    const likedVideo = await Like.find({likedBy:userId}).populate("video")
    // console.log(likedVideo)
    return res.status(200).json(new ApiResponse(200, likedVideo, "Fetched all liked Video Sucessfully"))


})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}