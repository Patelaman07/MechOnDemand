import { Router } from "express";
import { getUserAddressArray, login, logout, registerUser, resetPassword, sendresetOtp, updateUserData, updateUserLocation } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import userAuth from "../middlewares/userAuth.middleware.js";

const userRouter = Router()

userRouter.route("/register").post(registerUser);


userRouter.route("/login").post(login);

userRouter.route("/logout").post(logout);

userRouter.route("/reset-otp").post(sendresetOtp);

userRouter.route("/reset-password").post(resetPassword);

userRouter.route("/update-user-data").post(
    upload.fields(
        [
            {
                name: "avatar",
                maxCount: 1
            }
        ]
    ),
    userAuth,
    updateUserData
);

userRouter.route("/user-data").get(userAuth,getUserAddressArray);

userRouter.route("/update-location").post(userAuth,updateUserLocation);

export default userRouter;