import { Router } from "express";
import { userResHandler , loginUserHandler , logoutUserHandler} from "../controllers/user.controller.js";
import { multerUpload } from "../middlewares/multer.middleware.js";
import { identifyJWT } from "../middlewares/authUser.middleware.js";

let userRouter = Router();

userRouter.route('/render').post(
    multerUpload.fields([
        {
            name : 'avatar' ,
            maxCount : 1
        } , 
        {
            name : 'coverImage',
            maxCount : 1
        }
    ]) , 
    userResHandler
)

userRouter.route('/login' , loginUserHandler)
userRouter.route('/logout' , identifyJWT ,logoutUserHandler )

export { userRouter };