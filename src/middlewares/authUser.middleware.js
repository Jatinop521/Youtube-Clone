import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import ErrorApi from '../utils/errorApi.js';

dotenv.config();
export const identifyJWT = async (req, _ , next) => {
    try {
        const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
        if(!token){
            return next();
        }
    
        const decodedInfo = JWT.verify;(token , process.env.ACCESS_TOKEN_SECRET)

        req.user = decodedInfo._id;
        return next();
        
    } catch (error) {
        throw new ErrorApi(401 , error || 'You are not authorized to this account please login again')
    }

};