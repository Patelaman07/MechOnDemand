import { Router } from "express";
import { login, logout, mechRegister, resetPassword, sendresetOtp,updateMechanicData } from "../controllers/mech.controller.js";
import { upload } from "../middlewares/multer.middleware.js";


const mechRouter = Router();

mechRouter.route("/register").post(mechRegister);

mechRouter.route("/login").post(login);

mechRouter.route("/:id").post(
    upload.fields(
        [
            {
                name: "avatar",
                maxCount: 1
            }
        ]
    ),
    updateMechanicData
);

mechRouter.route("/logout").post(logout);

mechRouter.route("/reset-otp").post(sendresetOtp);
mechRouter.route("/reset-password").post(resetPassword)




export default mechRouter;