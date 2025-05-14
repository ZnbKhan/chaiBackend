import { response } from "express";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js"
import {User} from "../models/user.models.js"
import {uploadCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"


// this function return acessToken and refresh token
const generateAcessAndRefreshToken = async(userId)=>{ 
    //jb bhi ye fn call hoga user find krega
    // generate acess token and refresh token
    // save refresh token in db
    // lastly return refresh and acess token
    try {
         const user = await User.findById(userId)
         const accessToken = user.generateAcessToken()
         const refreshToken =  user.generateRefreshToken()
         
        //  console.log("user from generateAcessAndRefreshToken: ", user)
        //  console.log("acessToken: ", accessToken)
        //  console.log("refreshToken: ", refreshToken)

         user.refreshToken = refreshToken
         await user.save({ validateBeforeSave:false })  //refresh token save krne k time password save nhi krna h 
         
         return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and acess token")
    }
}



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

console.log("Existed User: ", existedUser)

if(existedUser){
    throw new ApiError(409, "User with email or username already exist")
}

console.log("req.files: ", req.files)
const avatarLocalPath = req.files?.avatar[0]?.path //ye acess multer ne diya hai jaise express ne req.body tha
console.log("avatarLocalPath: ", avatarLocalPath)

// const coverImageLocalPtah = req.files?.coverImage[0]?.path  -- ye error de rha agr coverImage proviode nhi kr rhe hai
// console.log("coverImageLocalPtah: ", coverImageLocalPtah)

let coverImageLocalPtah;
if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
    coverImageLocalPtah = req.files.coverImage[0].path;
}

console.log(coverImageLocalPtah)

if(!avatarLocalPath){
    throw new ApiError(400, "Avatar file is required");
}

const avatar = await uploadCloudinary(avatarLocalPath)
console.log("avatar on cloudinary: ", avatar)

const coverImage = await uploadCloudinary(coverImageLocalPtah)
console.log("coverImage on cloudinary: ", coverImage)

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

 console.log("created user: ", createdUser)

 if(!createdUser){
    throw new ApiError(500, "Something wennt wrong while registering the user")
 }

return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered sucessfully")
)


})

const loginUser = asyncHandler( async(req,res)=>{
    // taken email/username password from req.body
    // check username/email password hai ya nhi
    // find user
    // password encrypt -- db k password se match
    // sucessfull -- generate acess token and refresh token
    // send cookies

    const {username, email, password} = req.body;
    // console.log("req.body: ", req.body)
    
    if(!username && !email){
        throw new ApiError(400, "username or email is required")
    }

   const user = await User.findOne({
     $or: [{username}, {email}]
   })

//    console.log("user: ", user)
   if(!user){
    throw new ApiError(404, "User doesn't exist")
   }

   const  isPasswordValid = await user.isPasswordCorrect(password)
//    console.log("isPasswordValid:", isPasswordValid)

    if(!isPasswordValid){
    throw new ApiError(401, "Invalid user credentials")
   }

   const {accessToken, refreshToken} = await generateAcessAndRefreshToken(user._id)
//    console.log(user)
//    console.log("access Token :", accessToken)
//    console.log("refresh Token :", refreshToken)
   
   const loggedInUser= await User.findById(user._id).select("-password -refreshToken") //hmne refresh token add kiya h iss user mai ar hide kr diya hai loggedinuser se
    // console.log(loggedInUser)

   const options = {  //srf server se modify hogi frontend se nhi ho skta
      httpOnly:true,
      secure:true,
   }

   return res
   .status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken", refreshToken, options)
   .json(
    new ApiResponse( //ye islye bhj rhe mobile app mai save ho jaye
        200,
        {
            user:loggedInUser, refreshToken, accessToken
        },
        "User logged In Sucessfully"
    )
   )

} )


const logoutUser = asyncHandler( async(req,res)=>{
    // clear acess token and refresh token from cookie
    const deletedToken  =  await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
     )

    //  console.log("deletedToken: ", deletedToken)

     const options = {  //srf server se modify hogi frontend se nhi ho skta
      httpOnly:true,
      secure:true,
   }

   return res
   .status(200)
   .clearCookie("accessToken", options)
   .clearCookie("refreshToken", options)
   .json(new ApiResponse(200, {}, "User Logged Out"))
} )


const refreshAccessToken = asyncHandler( async(req,res)=>{
//    refresh token bhjna hai cookies ya req.body agr mobile app use ho rha ho
//    token verify krna db wale  ar incoming token
//    decoded token milega db query krk user find kr lenge
//    fr match krwaenge dono token ko
//    ab nya generate kr lenge nya db mai savr krenge ar cookies mai save kr denge

    const incomingToken =  req.cookies.refreshToken || req.body.refreshToken
    console.log("incoming token: ", incomingToken)

    if(!incomingToken){
       throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingToken, process.env.REFRESH_TOKEM_SECRET)
        console.log("decodedToken: ", decodedToken)     

       const user =  User.findById(decodedToken._id);
       console.log("user fron refreshTokenController: ", user)

       if(!user){
         throw new ApiError(401, "Invalid refresh token")
       }
    
       if(incomingToken !== user?.refreshToken){
         throw new ApiError(401, "Refresh token is expired or use")
       }
    
       const {newRefreshToken, accessToken} = await generateAcessAndRefreshToken(user._id)
        console.log("newRefreshToken from refreshAcessTokenController: ", newRefreshToken);
        console.log("acessToken from refreshTokenAcessController: ", accessToken) 

       const options={
        httpOnly:true,
        secure:true,
       }
    
       return res
       .status(200)
       .cookie("accessToken", accessToken, options)
       .cookie("refreshToken", newRefreshToken, options)
       .json(
          new ApiResponse(
            200,
            {
              accessToken,
              newRefreshToken  
            },
            "Acess token refreshed sucessfully"
          )
       )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }


} )

export { registerUser, loginUser, logoutUser, refreshAccessToken}