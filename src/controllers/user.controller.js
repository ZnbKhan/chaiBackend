import { response } from "express";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js"
import {User} from "../models/user.models.js"
import {uploadCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async(req, res)=>{
// get user details from frontend 
// validation - not empty
// check if user alreday exist: username, email
// check for images, check for avatar
// upload them on cloudinary, avatar
// create user object - create entry in db
// remove password and refresh token field from response
// check response aaya hai ya nhi -- user creatiom
// return response

 const {username, email, fullname, password} = req.body
 console.log("req.body: ",req.body)

//  validation
// if(fullname === ""){
//     throw new ApiError(400, "fullname is required")
// }

if(
   [fullname, email, username, password].some( (field)=>{
    return  field?.trim() === ""
   }) 
){
   throw new ApiError(400, "All fields are required")
}

const existedUser = await User.findOne({
    $or:[ { username },{ email } ]
})

// console.log("Existed User: ", existedUser)

if(existedUser){
    throw new ApiError(409, "User with email or username already exist")
}

// console.log("req.files: ", req.files)
const avatarLocalPath = req.files?.avatar[0]?.path //ye acess multer ne diya hai jaise express ne req.body tha
// console.log("avatarLocalPath: ", avatarLocalPath)

// const coverImageLocalPtah = req.files?.coverImage[0]?.path  -- ye error de rha agr coverImage proviode nhi kr rhe hai
// console.log("coverImageLocalPtah: ", coverImageLocalPtah)

let coverImageLocalPtah;
if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
    coverImageLocalPtah = req.files.coverImage[0].path;
}

// console.log(coverImageLocalPtah)

if(!avatarLocalPath){
    throw new ApiError(400, "Avatar file is required");
}

const avatar = await uploadCloudinary(avatarLocalPath)
// console.log("avatar on cloudinary: ", avatar)

const coverImage = await uploadCloudinary(coverImageLocalPtah)
// console.log("coverImage on cloudinary: ", coverImage)

if(!avatar){
    throw new ApiError(400, "Avatar file is required")
}

const user = await User.create({
    username,
    fullname,
    avatar: avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
})

 const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
 )

//  console.log("created user: ", createdUser)

 if(!createdUser){
    throw new ApiError(500, "Something wennt wrong while registering the user")
 }

return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered sucessfully")
)


})


export {registerUser}