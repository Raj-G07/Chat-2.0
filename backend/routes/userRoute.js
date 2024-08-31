import express from "express"
import { followOrUnfollow, getSuggestedUsers, getProfile, login, logout, register, editProfile } from "../controllers/userController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import upload from "../middleware/multer.js"
const router= express.Router();

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/:id/profile").get(isAuthenticated,getProfile)
router.route("/suggested").get(isAuthenticated ,getSuggestedUsers)
router.route("/followorunfollow/:id").post(isAuthenticated,followOrUnfollow)
router.route("/profile/edit").post(isAuthenticated,upload.single('profilePhoto'),editProfile)

export default router