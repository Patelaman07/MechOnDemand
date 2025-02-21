import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Mechanic } from "../models/mech.model.js";
import transporter from "../utils/nodemailer.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const mechRegister = async (req,res) => {

    const {name, password, email, phone} = req.body;

    if(!name || !password || !email || !phone ){
        return res.status(400).json({success:false, message:"Missing Details"})
    }

    const avatarLocalPath = req.files?.avatar[0].path;

    if (!avatarLocalPath) {
        return res.status(400).json({ success: false, message: "Profile image is required" })
    }

    try {
        const existMechanic = await Mechanic.findOne({email});

        if(existMechanic){
            return res.json({success:false,  message:"Mechanic is allready exist with this email"})
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const avatar = await uploadOnCloudinary(avatarLocalPath);

        if (!avatar) {
            return res.status(400).json({ success: false, message: "Avatar is not uploaded on Cloudinary" })
        }

        const newMechanic = new Mechanic({ name,  password:hashedPassword, email, phone, avatar: avatar.url });

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
        return res.json({success:false,message:error.message})
    }

};

export const login = async (req,res) => {
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({success:false, message:"Missing Details"})
    }
    try {
        const existMech = await Mechanic.findOne({email});
        if(!existMech){
            return res.status(400).json({success:false,message:"Invalid Email"})
        }

        const IsMatch = await bcrypt.compare(password,existMech.password);

        if(!IsMatch){
            return res.status(400).json({success:false,message:"Invalid Password"})
        }
        
        const token = jwt.sign({id:existMech._id},process.env.JWT_SECRET,{expiresIn:'7d'});

        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production'? 'none':'strict',
            maxAge: 7*24*60*60*1000
        })

        return res.status(201).json({success:true, message:"You are Logged IN"})

    } catch (error) {
        return res.status(400).json({success:false,message:error.message})
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

export const sendresetOtp = async(req,res)=>{
    const {email} = req.body;
    if(!email){
        return res.json({success:false, message:"Missing Details"});
    }
    try {
        const user = await Mechanic.findOne({email});
        if(!user){
            return res.json({success:false,message:"Account does not Exist with this Email"});
        }
        const otp = String(Math.floor(1000 + Math.random() * 9000));

        user.otp = otp;

        user.otpExpireAt = Date.now() + 15* 60 * 1000;

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset code",
            text: `Your Reset Otp is ${otp},use to Reset your account password`
        };

        await transporter.sendMail(mailOption);

        return res.json({success:true,message:"Reset OTP is sent to Your mail"});

    } catch (error) {
        return res.json({success:false,message:error.message});
    }
};

export const resetPassword = async(req,res)=>{
    const {email,otp,newPassword} = req.body;
    if(!email||!otp||!newPassword){
        return res.json({success:false,message:"Missing Details"});
    }
    try {
        const user = await Mechanic.findOne({email});
        if(!user){
            return res.json({success:false,message:"User Not Found"});
        }

        if(user.otp === '' || user.otp !== otp){
            return res.json({success:false,message:"Invalid OTP"});
        }

        if(user.otpExpireAt < Date.now()){
            return res.json({success:false,message:"OTP Expired"});
        }

        const hashedNewPassword = await bcrypt.hash(newPassword,10);

        user.password = hashedNewPassword;
        user.otp = '';
        user.otpExpireAt = 0;

        await user.save();

        return res.json({success:true,message:"Your Password is Reset Succesfully"});

    } catch (error) {
        return res.json({success:false,message:error.message});
    }
};
