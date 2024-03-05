import { Router } from "express";
import {registerUser,loginUser,logoutUser,refreshAccessToken} from "../controllers/user.controller.js";
import  upload  from "../middlewares/multer.middleware.js";
import VerifyJWT from "../middlewares/authmiddleware.js";

const router=Router()

router.route("/register").post(
      upload.fields([
          {
              name: "avatar",
              maxCount: 1
          }, 
          {
              name: "coverImage",
              maxCount: 1
          }
      ]),
      registerUser
      )
  
router.route("/login").post(loginUser)

router.route("/logout").post(VerifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/update-password").post(VerifyJWT , updatepassword)
router.route("/current-user").get(VerifyJWT,CurrentUser)
router.route("/Update-Details").post(VerifyJWT,UpdateDetails)
router.route("/Update-Avatar-Image").post(VerifyJWT,upload.single("avatar"),UpdateAvatarImage)
router.route("/Update-Cover-Image").post(VerifyJWT,upload.single("coverimage"),UpdateCoverImage)
router.route("/c/:username").get(VerifyJWT, getAccountDetails)
router.route("/history").get(VerifyJWT, getWatchHistory)



export default router;