import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import transporter from "../utils/nodemailer.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";


export const registerUser = async (req, res) => {


    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Missing Details" })
        }
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({ success: false, message: "User is allready exist of this email" })
        }

        // hashing the passwords
        const hashedPassword = await bcrypt.hash(password, 10);


        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        
        const userId = user._id.toString();
        // generate the token
        const token = jwt.sign( { id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });

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

        return res.status(201).json({ success: true, message: "User Registerd Successfully",token,userId})

    } catch (error) {
        res.status(501).json({ success: false, message: error.message })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required." });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

       
     
        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Set cookie with token
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Respond with success
        return res.status(200).json({
            success: true,
            message: "You are logged in.",
            token,
          
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error"  });
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
        const user = await User.findOne({ email });
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
        const user = await User.findOne({ email });
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


export const updateUserData = async (req, res) => {
    try {
        const {fullName,email,role, phone,address,userId } = req.body;
        
        

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let avatarUrl = user.avatar; // Keep existing avatar if no new one is provided

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
        user.fullName = fullName || user.fullName;
        user.phone = phone || user.phone;
        user.avatar = avatarUrl;
        user.email = email || user.email;
      
        user.role = role || user.role;

        if (Array.isArray(address) && address.length > 0) {
            
            // Agar aap existing address me append karna chahte ho to yeh use karo:
            user.address.push(...address);
        }

        await user.save();

        return res.status(200).json({ success: true, message: "User updated successfully", user });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserAddressArray = async(req,res)=>{
    const {userId} = req.body;
    try {
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const {
            address: addresses = [],
            fullName: name = '',
            phone: mobile = '',
            email = '',
            avatar: avatarUrl = ''
        } = user || {};
        
        // Return a well-structured JSON response
        return res.status(200).json({
            success: true,
            message: "Fetched user data successfully",
            data: {
                name,
                mobile,
                email,
                avatarUrl,
                addresses
            }
        });

    } catch (error) {
         return res.status(500).json({ success: false, message: error.message });
    }

    
}

export const updateUserLocation = async (req, res) => {
  try {
    const { userId, latitude, longitude } = req.body;

    // Validate inputs
    if (!userId || typeof latitude === 'undefined' || typeof longitude === 'undefined') {
      return res.status(400).json({
        success: false,
        message: "Missing userId, latitude, or longitude",
      });
    }

    // Ensure latitude and longitude are valid numbers
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude or longitude",
      });
    }

    // Update the user location
    await User.findByIdAndUpdate(userId, {
      location: {
        type: "Point",
        coordinates: [lng, lat], // MongoDB expects [longitude, latitude]
      },
      updatedAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "User location updated",
    });

  } catch (err) {
    console.error("Error updating user location:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

  