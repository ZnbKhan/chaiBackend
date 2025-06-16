import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";

const router = Router();

router.route("/video/:videoId").post(verifyJWT, toggleVideoLike)
router.route("/comment/:commentId").post(verifyJWT, toggleCommentLike)
router.route("/tweet/:tweetId").post(verifyJWT, toggleTweetLike)
router.route("/liked-video").get(verifyJWT, getLikedVideos)

export default router;