import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'


export const verifyJWT = asyncHandler( async(req, _ ,next)=>{
     try {
        const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        //  console.log("token: ", token)
        if(!token){
           throw new ApiError(401, "Unauthorized request")
        }
   
       const decodedToken = jwt.verify(token, process.env.ACESS_TOKEN_SECRET)
        // console.log("\nDecoded token: ", decodedToken)

       const user =  await User.findById(decodedToken?._id).select("-password -refreshToken")
        // console.log("user: ", user)
       if(!user){
            throw new ApiError(401, "Invalid acess token")
       }
   
    //    console.log("req.user: ", req.user) -- undefined
       req.user = user;
    //    console.log("user: ", user)
    //    req.user is initially undefined.
    // You assign it manually after decoding and verifying the JWT.
    // This makes user data accessible in any route that comes after the middleware.
   
       next();
     } catch (error) {
        throw new ApiError(401, error?.message || "Invalid acess token")
        
     }
} )

