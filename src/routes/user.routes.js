import { Router } from "express";
import registerUser from "../controllers/user.controller.js";
import  upload  from "../middlewares/multer.middleware.js";

const route=Router()

route.route("/register").post(upload.fields([
      {
            name: "avatar",
            maxcount:1
      },
      {
            name:"coverimage",
            maxcount:1
      }

    ])
,registerUser)

export default route;