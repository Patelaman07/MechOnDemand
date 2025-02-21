import { Router } from "express";
import { login, logout, mechRegister, resetPassword, sendresetOtp } from "../controllers/mech.controller.js";
import { upload } from "../middlewares/multer.middleware.js";


const mechRouter = Router();

mechRouter.route("/register").post(
    upload.fields(
    [  
        {
            name:"avatar",
            maxCount: 1
        }
    ]),

    mechRegister
);

mechRouter.route("/login").post(login);
mechRouter.route("/logout").post(logout);

mechRouter.route("/reset-otp").post(sendresetOtp);
mechRouter.route("/reset-password").post(resetPassword)




export default mechRouter;