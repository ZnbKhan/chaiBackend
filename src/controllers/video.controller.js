import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {delteteFromClodinary, uploadCloudinary} from "../utils/cloudinary.js"


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

        // console.log("req.files: ", req.files?.videoFile?.[0]?.path)  //check routes
        
        const localVideoPath = req.files?.videoFile?.[0]?.path;
        console.log("local Video Path: ", localVideoPath)

        const uploadedVideo = await uploadCloudinary(localVideoPath)
        console.log("uploaded Video: ", uploadedVideo)

        if(!uploadedVideo){
            throw new ApiError(400, "Video is required")
        }
        
        const localThumbnailLocalPath = req.files?.thumbnail?.[0].path
        // console.log("localThumbnailPath: ", localThumbnailLocalPath)

        const uploadedThumbnail = await uploadCloudinary(localThumbnailLocalPath);
        // console.log("uploadedThumbnail: ", uploadedThumbnail.url)

        if(!uploadedThumbnail){
            throw new ApiError(400, "Thumnail is required")
        }

        const video =  await Video.create({
            title,
            description,
            videoFile:uploadedVideo.url,
            thumbnail:uploadedThumbnail.url,
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
    if(!video){
        throw new ApiError(500, "video does not exist")
    }
    // console.log(video)
    return res.status(200).json(new ApiResponse(200, video, "fetched video sucessfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    //TODO: update video details like title, description, thumbnail
    // retrieve video collection from db via videoId
    // call delteFromCloud to remove from cloud video and thumnail dono ar nyi de do
    try {
        const { videoId } = req.params
        
        if(!videoId){
            throw new ApiError(400, "video id is missing || unauthorize video id")
        }
        
        const {title, description} = req.body;
        // console.log("tilele and description: ", req.body);
    
        if(!title){
            throw new ApiError(400, "provide title please...")
        }
    
        if(!description){
            throw new ApiError(400, "provide description please...")
        }
       
        
        const video = await Video.findById(videoId)
        if(!video){
            throw new ApiError(500, "video not found")
        }
    
         // deleted from cloudinary
        await delteteFromClodinary(video.videoFile, 'video');
        await delteteFromClodinary(video.thumbnail, 'image');
    
        // console.log("deleted from clodinary: ");
    
        
        const localVideoPath = req.files?.videoFile?.[0]?.path;
        const uploadVideo = await uploadCloudinary(localVideoPath);
    
        const localThumnailPtah = req.files?.thumbnail?.[0]?.path
        const uploadThumbnail = await uploadCloudinary(localThumnailPtah)
    
        const updatedVideo = await Video.findByIdAndUpdate(videoId, {
            videoFile:uploadVideo.url,
            thumbnail:uploadThumbnail.url,
            title,
            description,
        },
        { new:true})
     
        return res.status(200).json(
            new ApiResponse(200, updatedVideo, "video updated sucessfully")
        )

    } catch (error) {
          throw new ApiError(500, error.message || "Error in update video API")
    }
    

})

const deleteVideo = asyncHandler(async (req, res) => {
    //TODO: delete video
    // get clodinary url from videoId by db query
    // call deleteFromcloudinary function
    // delete from clodinary 
    // delete from db
   try {
     const { videoId } = req.params
 
     if(!videoId){
         throw new ApiError(400, "video id is missing")
     }
 
     const video = await Video.findById(videoId)
     console.log("Video: ", video)
     
     if(!video){
         throw new ApiError(500, "video not found")
     }
     
     await delteteFromClodinary(video.videoFile, 'video')
 
     await Video.findByIdAndDelete(videoId)
 
     return res.status(200).json(new ApiResponse(200,{}, "video deleted sucessfully"))
   } catch (error) {
      throw new ApiError(500, error.message || "Error while deleting video")
   }

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
