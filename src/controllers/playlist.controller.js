import {Playlist} from '../models/playlist.models.js'
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from '../models/user.models.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import { Video } from '../models/video.models.js'

const createPlaylist = asyncHandler(async (req, res) => {
    //TODO: create playlist
    // take name and description from req.body
    // save in db
    const {name, description} = req.body

    if(!name.trim() || !description.trim()){
        throw new ApiError(400, "Please Provide name and description of playlist")
    }

    // const user = await User.findById(req.user._id).select("-password -refreshToken -avatar -coverImage")
    // if(!user){
    //     throw new ApiError(400, "User is unauthorized")
    // }
    
    // // console.log(user._id)
    // const video = await Video.findOne(user._id.owner)
    // console.log("video: ", video)

    // if(video.title != title ){
    //     throw new ApiError
    // }
    
    const playlist = await Playlist.create({
        name,
        description,
        owner:req.user._id,
     })

     if(!playlist){
        throw new ApiError(500, "Eroor while creating playlist")
     }

     return res.status(200).send(new ApiResponse(200, playlist, "Playlist is created"))


})

const getUserPlaylists = asyncHandler(async (req, res) => {
    //TODO: get user playlists
    // user is already loggedin
    // check in playlist if we any playlist related to this user
    // fetch that playlist
    const {userId} = req.params

    try {
        if(!userId){
             throw new ApiError(400, "userId is not valid")
        }

        const playlist = await Playlist.find({owner:userId});

        if(!playlist){
            throw new ApiError(400, "Playlist not found")
        }

       return res.status(200).send(new ApiResponse(200, playlist, "Plyalist fetched sucessfully"))
    
    } catch (error) {
       return res.status(500).send(new ApiError(500, "Error in playlist API"))
    
}    

    

})

const getPlaylistById = asyncHandler(async (req, res) => {
    //TODO: get playlist by id
    // now I am providing the playlist id need to have that playlist
    const {playlistId} = req.params
    if(!playlistId){
        throw new ApiError(400,"playlist is not found with this id")

    }

    const playList = await Playlist.findById(playlistId)

    if(!playList){
        throw new ApiError(400, "Playlist not found")
    }

    return res.status(200).send(new ApiResponse(200, playList, "Plyalist fetched sucessfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

})

const deletePlaylist = asyncHandler(async (req, res) => {
    // TODO: delete playlist
    // take id from req.params 
    // check id that playlist exist
    // delete that playList
    const {playlistId} = req.params
    // console.log(playlistId)
    if(!playlistId){
        throw new ApiError(400, "playlist id not found")
    }

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId)

    if(!deletedPlaylist){
        throw new ApiError(404, "playlist already deleted")
    }

    return res.status(200).send( new ApiResponse(200, "Playlist deleted sucessfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
