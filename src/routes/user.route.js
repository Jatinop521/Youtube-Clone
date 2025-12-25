import { Router } from "express";
import { userResHandler } from "../controllers/user.controller.js";
import { multerUpload } from "../middlewares/multer.middleware.js";

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

export { userRouter };