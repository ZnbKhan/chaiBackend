import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/likes.models.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.models.js"

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
    const {commentId} = req.params
    //TODO: toggle like on comment

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}