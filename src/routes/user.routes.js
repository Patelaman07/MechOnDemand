import { Router } from "express";
import { login, logout, registerUser, resetPassword, sendresetOtp } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const userRouter = Router()

userRouter.route("/register").post(
    upload.fields(
    [  
        {
            name: "avatar",
            maxCount: 1
        }
    ]
    ),
    registerUser
);

userRouter.route("/login").post(login);

userRouter.route("/logout").post(logout);

userRouter.route("/reset-otp").post(sendresetOtp);

userRouter.route("/reset-password").post(resetPassword);

export default userRouter;