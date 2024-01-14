import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';


cloudinary.config({
  cloud_name: process.env.CLOUDINAY_NAME,
  api_key: process.env.CLOUDINAY_API_KEY,
  api_secret: process.env.CLOUDINAY_API_SECRECT
});

export const uploadFileOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null
    const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" })
    console.log("File uploaded on cloudinary successfull!", response.url)
    return response
  } catch (error) {
    fs.unlinkSync(localFilePath)
  }
}