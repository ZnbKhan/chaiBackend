import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.mIddleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { deleteVideo, getVideoById, publishVideo, updateVideo } from "../controllers/video.controller.js";

const router = Router();

router.route("/publish-video").post(verifyJWT, upload.fields([
    {
        name:"videoFile",
        maxCount:1,
    },
    {
        name:"thumbnail",
        maxCount:1,
    }
]) ,publishVideo)

router.route("/get-video/:videoId").get(verifyJWT, getVideoById)
router.route("/delete-video/:videoId").delete(verifyJWT, deleteVideo)
router.route("/update-video/:videoId").put(verifyJWT, upload.fields(
    [
        {
            name:"videoFile",
            maxCount:1,
        },
        {
            name:"thumbnail",
            maxCount:1,
        }
    ]
) ,updateVideo)

export default router



/* 
upload.fields([
  { name: 'videoFile', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
])

eqauls to this 
So req.files is an object, like this:

{
  videoFile: [ {  file object  } ]
  thumbnail: [ {  file object  } ]
}



*/