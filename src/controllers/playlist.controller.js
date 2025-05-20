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
    const {userId} = req.params
    //TODO: get user playlists
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
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
