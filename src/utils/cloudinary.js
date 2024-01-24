import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_API_CLOUDNAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET, 
  });

const uploadOnCloudinary = async (filePath)=>{
   try {
    if(!filePath) return null
    const response = await cloudinary.uploader.upload(filePath,{
        resource_type: "auto",
    });
    
    console.log("file uploaded successfully" , response.url);
    return response;
   } catch (error) {
    fs.unlinkSync(filePath) // remove the locally saved temporary file from local as the upload operation got failed
    return null;
   }
}

export {uploadOnCloudinary};