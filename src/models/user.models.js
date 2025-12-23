import mongoose , {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
let saltsRound = 10 ;

const userSchema = new Schema({
    userName : {
        type : String, 
        required : true,
        unique : true,
        lowercase : true,
        trim : true, 
        index : true
    },
    email : {
        type : String, 
        required : true,
        unique : true,
        lowercase : true,
        trim : true        
    },
    fullname : {
        type : String,
        required : true,
        trim : true,
        index : true
    },
    avatar : {
        type: String , // use cloudinary for bucket storage of avatar url
        required : true
    },
    coverImage : {
        type: String // Same Cloudinary for here also to get url
    },
    watchHistory: [
        {
            type : Schema.Types.ObjectId,
            ref : 'Video'
        }
    ],
    password: {
        type : String , // for Encryption purpose
        required : [true , "Password must required"]
    },
    refreshToken : {
        type : String
    }

} , {timestamps : true})

userSchema.pre('save' , async function(next){
    if(! this.isModified('password')) return next();

    this.password = bcrypt.hash(this.password , saltsRound)
    next();
})

userSchema.method.passCompare = async function (password) {
    return bcrypt.compare(password , this.password)
}
userSchema.method.generateAccessToken = function () {
    return jwt.sign({
        _id : this._id ,
        email : this.email ,
        username : this.userName ,
        fullname : this.fullname

    } , process.env.ACCESS_TOKEN_SECRET  , 
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    }   
    )
}
userSchema.method.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id : this._id
        } , 
        process.env.REFRESH_TOKEN_SECRET ,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User' , userSchema);