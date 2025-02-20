import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import transporter from "../utils/nodemailer.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


export const registerUser = async (req, res) => {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !phone) {
        return res.status(400).json({ success: false, message: "Missing Details" })
    }
    const avatarLocalPath = req.files?.avatar[0].path;

    if (!avatarLocalPath) {
        return res.status(400).json({ success: false, message: "Avatar is required" })
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User is allready exist of this email" })
        }

        // hashing the passwords
        const hashedPassword = await bcrypt.hash(password, 10);

        const avatar = await uploadOnCloudinary(avatarLocalPath);

        if (!avatar) {
            return res.status(400).json({ success: false, message: "Avatar is not uploaded on Cloudinary" })
        }


        const user = new User({ name, email, password: hashedPassword, phone, role, avatar: avatar.url });
        await user.save();

        // generate the token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        //send the generated token to the cookies
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to the MechOnDemand",
            text: `Hello, Your welcome to create a account on our website MechOnDemand using the email: ${email}`
        }

        await transporter.sendMail(mailOption);

        return res.status(201).json({ success: true, message: "User Registerd Successfully", token })

    } catch (error) {
        res.status(401).json({ success: false, message: error.message })
    }
}