import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import { ApiError } from './ApiErrors.js';

cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME , 
  api_key:process.env.CLOUDINARY_API_KEY, 
  api_secret:process.env.CLOUDINARY_API_SECRET
});

const uploadCloudinary = async(localFilePath)=>{
     try {
        if(!localFilePath) return null;
        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type:"auto",
        })
        // file has been uploaded sucessfully
      //   console.log("file uploaded on cloudinary and response is: ", response)
      //   console.log("file is uploaded on cloudinary and url is: ", response.url);

        fs.unlinkSync(localFilePath) //removing file for server
        return response;
     } catch (error) {
        fs.unlink(localFilePath) // remove the locally saved temporary file as the upload operation got failed

        return null;
        
     }
}

const delteteFromClodinary = async(url, resourceType)=>{
    try {
        const extractedUrl = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
        // console.log("Extracted Public URL: ", extractedUrl)

        if(!extractedUrl){
          throw new ApiError(400, "unauthorized url");
        }
        const publicId = extractedUrl?.[1];
        // console.log("public :", publicId)

        await cloudinary.uploader.destroy(publicId,{
          resource_type:resourceType
        });
        
        console.log("Deleted from cloudinary successfully")
    } catch (error) {
      throw new ApiError(500, error?.message || "Error delteing from cloudinary")
    }
}



export {uploadCloudinary, delteteFromClodinary}