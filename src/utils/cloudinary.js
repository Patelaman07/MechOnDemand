import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key:process.env.CLOUDINARY_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async(locatFilePath)=>{
    try {
        if(!locatFilePath) return null;

        const response = await cloudinary.uploader.upload(locatFilePath,{
            resource_type:"auto"
        })

        fs.unlinkSync(locatFilePath)
        
        return response;
    } catch (error) {
        fs.unlinkSync(locatFilePath)
        return null
    }
}

export {uploadOnCloudinary}