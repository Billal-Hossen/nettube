import { Router } from "express";
import { register, login, logout } from "../controllers/user.controller.js";
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

export default router