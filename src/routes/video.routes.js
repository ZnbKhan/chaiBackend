import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.mIddleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { getVideoById, publishVideo } from "../controllers/video.controller.js";

const router = Router();

router.route("/publish-video").post(verifyJWT, upload.single("videoFile") ,publishVideo)
router.route("/get-video/:videoId").get(verifyJWT, getVideoById)

export default router