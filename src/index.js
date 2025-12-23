import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import { DB_NAME } from "./container.js";
let app = express();
dotenv.config();


import { Connector } from "./db/index.js";

Connector()
.then(() => {
    app.on('error', (error) => {
        console.log('Error Occred in loading app in index.js' , error)
        throw error;
    }
    )
    app.listen(process.env.PORT || 8000 , () => {
        console.log('Settings loaded successfully')
    })
}
)
.catch((e) => console.log('Error Occured In the Connector ' , e));
// (async () => {
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on('error' , (error)=> {
//             console.log('Error due to app incapability with the DB' , error)
//             // throw error;
//         })
//         app.listen(process.env.PORT , () => {
//             console.log('Successfully connected to our Db')
//         })
//     }catch(error){
//         console.log('Error :' , error)
//     }
// })();

