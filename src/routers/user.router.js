import { Router } from "express";
import { register, login, logout, getCurrentUser, changePassword, updateAvatar, updateCoverImg, getUserChannelProfile } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";

const router = Router()

router.route('/register').post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1
    },
    {
      name: "coverImg",
      maxCount: 1
    }
  ]),
  register)

router.route('/login').post(login)

router.route('/logout').post(authenticate, logout)

router.route('/current-user').post(authenticate, getCurrentUser)

router.route("/change-password").post(authenticate, changePassword)
router.route("/change-avatar").post(authenticate, upload.single("avatar"), updateAvatar)
router.route("/change-cover").post(authenticate, upload.single('coverImg'), updateCoverImg)
router.route("/channel-profile").post(authenticate, getUserChannelProfile)

export default router