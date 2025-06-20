import { Router } from "express";
import {verifyJWT} from '../middlewares/auth.middleware.js'
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweet.controller.js";

const router = Router();

router.route("/create-tweet").post(verifyJWT, createTweet)
router.route("/get-tweet").get(verifyJWT, getUserTweets)
router.route("/update-tweet/:tweetId").post(verifyJWT, updateTweet)
router.route("/delete-tweet/:tweetId").delete(verifyJWT, deleteTweet)

export default router;