import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Mechanic } from "../models/mech.model.js";
import transporter from "../utils/nodemailer.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const mechRegister = async (req, res) => {

    const { name, password, email } = req.body;

    if (!name || !password || !email) {
        return res.status(400).json({ success: false, message: "Missing Details" })
    }

    try {
        const existMechanic = await Mechanic.findOne({ email });

        if (existMechanic) {
            return res.json({ success: false, message: "Mechanic is allready exist with this email" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);




        const newMechanic = new Mechanic({ name, password: hashedPassword, email });

        await newMechanic.save();


        // generate the token
        const token = jwt.sign({ id: newMechanic._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

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

        return res.status(201).json({ success: true, message: "Mechanic Registerd Successfully", token })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }

};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ success: false, message: 'Missing email or password' });
        }

        const existMech = await Mechanic.findOne({ email });

        if (!existMech) {
            return res
                .status(400)
                .json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, existMech.password);

        if (!isMatch) {
            return res
                .status(400)
                .json({ success: false, message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: existMech._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res
            .status(200)
            .json({ success: true, message: 'You are Logged IN', token });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: 'Login failed', error: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'node' : "strict",
        });

        return res.status(201).json({ success: true, message: "Logged Out" });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const sendresetOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.json({ success: false, message: "Missing Details" });
    }
    try {
        const user = await Mechanic.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Account does not Exist with this Email" });
        }
        const otp = String(Math.floor(1000 + Math.random() * 9000));

        user.otp = otp;

        user.otpExpireAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset code",
            text: `Your Reset Otp is ${otp},use to Reset your account password`
        };

        await transporter.sendMail(mailOption);

        return res.json({ success: true, message: "Reset OTP is sent to Your mail" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: "Missing Details" });
    }
    try {
        const user = await Mechanic.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User Not Found" });
        }

        if (user.otp === '' || user.otp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (user.otpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP Expired" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedNewPassword;
        user.otp = '';
        user.otpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: "Your Password is Reset Succesfully" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


export const updateMechanicData = async (req, res) => {
    try {
        const { address, phone } = req.body;
        const { id } = req.params;

        // Find user by ID
        const mechanic = await Mechanic.findById(id);
        if (!mechanic) {
            return res.status(404).json({ success: false, message: "mechanic not found" });
        }

        let avatarUrl = mechanic.avatar; // Keep existing avatar if no new one is provided

        // Handle avatar upload if provided
        if (req.files?.avatar?.[0]?.path) {
            const avatarLocalPath = req.files.avatar[0].path;
            const uploadedAvatar = await uploadOnCloudinary(avatarLocalPath);

            if (!uploadedAvatar) {
                return res.status(400).json({ success: false, message: "Avatar upload failed" });
            }
            avatarUrl = uploadedAvatar.url;
        }

        // Update user fields
        mechanic.address = address || user.address;
        mechanic.phone = phone || user.phone;
        mechanic.avatar = avatarUrl;

        await Mechanic.save();

        return res.status(200).json({ success: true, message: "Mechanic updated successfully", user });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateMechanicLocation = async (req, res) => {
    
    const { latitude, longitude,mechanicId } = req.body;

    try {
        await Mechanic.findByIdAndUpdate(mechanicId, {
            location: {
                type: "Point",
                coordinates: [parseFloat(longitude), parseFloat(latitude)],
            },
        });

        res.status(200).json({ message: "Mechanic Location Updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating mechanic location" });
    }
};

