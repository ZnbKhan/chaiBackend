import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPlaylist, deletePlaylist } from "../controllers/playlist.controller.js";

const router = Router();

router.route("/create-playlist").post(verifyJWT, createPlaylist)
router.route("/delete-playlist/:playlistId").delete(verifyJWT, deletePlaylist)


export default router;