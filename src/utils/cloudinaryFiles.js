import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const cloudinaryUploader= async function (filePath) {
    try{
        if(!filePath) return ; 
        const response = await cloudinary.uploader.upload(filePath , 
            {
                resource_type : auto
            }
        )

        console.log(`File uploaded successfully with path : ${response.url}`)
        return response;
    }catch{
        fs.unlinkSync(filePath) // Use to remove file from Db 
        return null;
    }
}

export {cloudinaryUploader}

