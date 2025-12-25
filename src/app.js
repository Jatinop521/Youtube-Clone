import express from 'express'
import cookieParser from 'cookie-parser';
import cors from "cors";
let app = express();

app.use(cors({
    origin: process.env.ORIGIN_NAME,
    credentials : true
   } 
))


app.use(express.json({limit : '16kb'}))
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.urlencoded({extended: true , limit: '16kb'}))


import { userRouter } from './routes/user.route.js';

app.use('/api/v1/user' , userRouter)

export {app};