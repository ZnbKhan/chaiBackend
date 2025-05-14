import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video
    // take title and description from req.body
    // validate title and description
    // localVideoPath req.file multer ki help se ek video daal rhi hu so req.file instead of req.files
    // upload on cloudinary
    // create object of video whuch also saves in db and takes duration from uploadedVideo on cloudinary
    // done 
   
    try {
        const { title, description} = req.body
        // console.log("req.body: ", req.body)
    
        if(!title.trim() || !description.trim()){
            throw new ApiError(400, "Provide video title and desctiption")
        }
        
        const localVideoPath = req.file?.path;
        // console.log("local Video Path: ", localVideoPath)
    
        const uploadedVideo = await uploadCloudinary(localVideoPath)
        // console.log("uploaded Video: ", uploadedVideo)
    
        if(!uploadedVideo){
            throw new ApiError(400, "Video is required")
        }
    
        const video =  await Video.create({
            title,
            description,
            videoFile:uploadedVideo.url,
            duration:uploadedVideo?.duration,
            owner:req.user?._id
        })
          
        // console.log("video: ", video)
        
         return res
        .status(201)
        .json(new ApiResponse(200, video,"Video uploaded sucessfully"))
    } catch (error) {
         throw new ApiError(500, error?.message || "Error while uploading video")
    }


})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params //how videoId comes in params -- headache of frontend dev
    //TODO: get video by id
    const video =  await Video.findById(videoId);
    // console.log(video)
    return res.status(200).json(new ApiResponse(200, video, "fetched video sucessfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
