import { handleasync } from "../utils/handleasync.js";
import ErrorApi from "../utils/errorApi.js";
import { User } from "../models/user.models.js";
import { cloudinaryUploader } from "../utils/cloudinaryFiles.js";
import ResponseApi from "../utils/ResponseApi.js";

// Taking the user input from req
// Validating the data 
// Checking if UserName and Email already exists
// taking avatar and coverImage
// Uploading image to Claudinary
// Connect to the DataBase
// Remove Password and refreshToken
// Return if userInfo Saved

const userRes = async (req, res)=>{
    res.status(200).json({
        message : 'Ok'
    })
    console.log(req.body)
    const {userName , email , fullname, password } = req.body;

    if([userName , email , password , fullname].some((response) => response?.trim === "")){
        throw new ErrorApi(400 , 'Input Fields is Needed') 
    }

    const existedUser = User.findOne( {
        $or : [{userName} , {email}]
    })

    if(existedUser){
        throw new ErrorApi(409 , 'User Already Existed')
    }

    const avatarLocalStorage = req.files?.avatar[0]?.path
    const coverImageLocalStorage = req.files?.coverImage[0]?.path

    if(!avatarLocalStorage){
        throw new ErrorApi(409 , 'Avatar Is Required')
    }

    const avatarCloud = cloudinaryUploader(avatarLocalStorage);
    const coverImageCloud = cloudinaryUploader(coverImageLocalStorage);

    if(!avatarCloud){
        throw new ErrorApi(500 , 'Avartar is Not loaded')
    }

    const user = await User.create({
        userName : userName.toLowerCase() ,
        email ,
        fullname ,
        password ,
        avatar : avatarCloud.url , 
        coverImage : coverImageCloud?.url || ''
    })


    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser){
        throw new ErrorApi(500 , 'User Creation Failed')
    }

    return res.status(200).json(
        ResponseApi(200 , 'User Added SuccessFull' , createdUser)
    )

}

const userResHandler = handleasync(userRes);

export {userResHandler}
