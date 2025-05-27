import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists } from "../controllers/playlist.controller.js";

const router = Router();

router.route("/create-playlist").post(verifyJWT, createPlaylist)
router.route("/delete-playlist/:playlistId").delete(verifyJWT, deletePlaylist)
router.route("/get-user-playlist/:userId").get(verifyJWT, getUserPlaylists)
router.route("/get-playlist/:playlistId").get(verifyJWT, getPlaylistById)


export default router;