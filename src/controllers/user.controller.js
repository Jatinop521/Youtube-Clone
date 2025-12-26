import { handleasync } from "../utils/handleasync.js"
import ErrorApi from "../utils/errorApi.js";
import { cloudinaryUploader } from "../utils/cloudinaryFiles.js";
import { User } from "../models/user.models.js";
import ResponseApi from "../utils/ResponseApi.js";

const userResHandler = handleasync(async (req, res) => {
    res.json({
        message : 'Hello World!'
    })

    const {userName , fullname , email , password} = req.body;

    if([userName , fullname , email , password].some((response) => response?.trim === "")){
        throw new ErrorApi(400 , 'All Fields be needed')
    }

    const avatarLocal = req.files?.avatar?.[0]?.path;
    const coverImageLocal = req.files?.coverImage?.[0]?.path;

    if(!avatarLocal){
        throw new ErrorApi(400 , 'Avatar is required')
    }

    const avatar = cloudinaryUploader(avatarLocal);
    const coverImage = cloudinaryUploader(coverImageLocal);

    if(!avatar){
        throw new ErrorApi(500 , 'Error in uploading avatar')
    }

    const user =await User.create({
        userName : userName.toLowerCase(),
        fullname,
        email,
        password,
        avatar : avatar.url,
        coverImage : coverImage?.url || ''
    })

    const createdUser = await User.findById(user._id).select('-password -refreshToken');  // Exclude sensitive info

    if(!createdUser){
        throw new ErrorApi(500 , 'Error in creating user')
    }

    return res.status(201).json(
        ResponseApi(200 , createdUser , 'User created successfully')
    )


})
export {userResHandler}