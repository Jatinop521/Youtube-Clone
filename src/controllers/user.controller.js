import { handleasync } from "../utils/handleasync.js"
import ErrorApi from "../utils/errorApi.js";
import { cloudinaryUploader } from "../utils/cloudinaryFiles.js";
import { User } from "../models/user.models.js";
import ResponseApi from "../utils/ResponseApi.js";
import JWT from 'jsonwebtoken';
//Miter Middleware should be in the direct code

const options = {
        httpOnly : true,  /// Mitre Server Only can Change this
        secure : true
}

// This function is to Generate Access and Refresh Token use for authentication;
const generateAccessAndRefreshToken = async(userId) => {
    try{
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken();

        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave : false})

        return {accessToken , refreshToken}
    }catch{
        throw new ErrorApi(500 , 'Failed to Generate Access and Refresh Tokens')
    }
    
}


const userResHandler = handleasync(async (req, res) => {
    res.json({
        message : 'Hello World!'
    })

    const {userName , fullname , email , password} = req.body;

    if([userName , fullname , email , password].some((response) => response?.trim === "")){
        throw new ErrorApi(400 , 'All Fields be needed')
    }

    const existingUser = await User.findOne({
        $or : [{userName} , {email}]
    })

    if(existingUser){
        throw new ErrorApi(400 , 'User with given userName or email already exists')
    }

    console.log('Files received in multer : ' , req.files);

    const avatarLocal = req.files?.avatar?.[0]?.path;
    // const coverImageLocal = req.files?.coverImage?.[0]?.path;

    let coverImageLocal;
    if(req.files && req.files['coverImage'] && req.files['coverImage'][0]){
        coverImageLocal = req.files['coverImage'][0].path;
    }

    console.log('Avatar Local Path : ' , avatarLocal);

    if(!avatarLocal){
        throw new ErrorApi(400 , 'Avatar is required')
    }

    const avatar = await cloudinaryUploader(avatarLocal);
    const coverImage = await cloudinaryUploader(coverImageLocal);

    console.log(avatar)
    console.log(avatar.url)
    if(!avatar){
        throw new ErrorApi(500 , 'Error in uploading avatar')
    }

    const user = await User.create({
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
        new ResponseApi(200 , createdUser , 'User created successfully')
    )


})

const loginUserHandler = handleasync(async (req , res) => {

    const {userName , email , password} =  req.body;

    if(!userName && !email){
        throw new ErrorApi(400 , 'userName or email is required')
    }

    const IsUser= User.findOne({
        $or : [{userName} , {email}]
    });

    if(!IsUser){
        throw new ErrorApi(409 , 'User Not Found!')
    }

    if(!password){
        throw new ErrorApi(400 , 'Password is required')
    }

    const IsMatchedPassword = await IsUser.passCompare(password);
    if(!IsMatchedPassword){
        throw new ErrorApi(400 , 'Wrong Password')
    }

    const {accessToken , refreshToken} = await generateAccessAndRefreshToken(IsUser._id);


    return res.status(200)
    .cookie('accessToken' , accessToken , options)
    .cookie('refreshToken' , refreshToken , options)
    .json(
        new ResponseApi(200 , "User logged in successfully",{
            user : IsUser,
            accessToken,
            refreshToken
        })
    )

})

const logoutUserHandler = handleasync(async (req , res) => {
    // Mitre Logout Do not Delete the ID ! Remember that >>> 
    // Not Directly as I have to out that people which is Really Out
 
    await User.findByIdAndUpdate(req.user._id , {
        refreshToken : undefined
    }, {new : true})

    return res.status(200)
    .cookie('accessToken', options)
    .cookie('refreshToken', options)
    .json(
        new ResponseApi(200, 'User logged out successfully')
    )
})

const refreshTokenHandler = handleasync(async (req , res) => {
    const refreshToken = req.cookies.refreshToken 
    || req.headers.authorization?.split(' ')[1] 
    || req.body.refreshToken;

    if(!refreshToken){
        throw new ErrorApi(400 , 'Refresh Token is required')
    }

    
    try {
        const decodedToken = JWT.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET) // Where we save Expiry ?
    } catch (error) {
        throw new ErrorApi(401 , 'Invalid or Expired Refresh Token')
    }


    const user = await User.findById(decodedToken._id).select("-password -refreshToken")

    if(!user || user.refreshToken !== refreshToken){
        throw new ErrorApi(401 , 'Invalid Refresh Token or User not found')
    }

    const {accessToken , newRefreshToken} = await generateAccessAndRefreshToken(user._id);

    return res.status(200)
    .cookies('accessToken' , accessToken , options)
    .cookies('refreshToken' , newRefreshToken , options)
    .json(
        new ResponseApi(200 , 'Tokens refreshed successfully' , {
            accessToken,
            refreshToken : newRefreshToken
        })
    )

})

export {
     userResHandler
    , loginUserHandler 
    , logoutUserHandler
    , refreshTokenHandler
};