import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})
const cloudinaryUploader= async function (filePath) {
    try{
        if(!filePath) return null; 
        const response = await cloudinary.uploader.upload(filePath , 
            {
                resource_type : "auto"
            }
        )

        console.log(`File uploaded successfully with path : ${response.url}`)
        return response;
    }catch(error){
        console.log('Error in uploading file to cloudinary : ' , error);
        fs.unlinkSync(filePath) // Use to remove file from Db 
        return null;
    }
}

export {cloudinaryUploader}

