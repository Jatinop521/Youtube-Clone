import mongoose from "mongoose";
import { DB_NAME } from "../container.js";
import dotenv from "dotenv";
dotenv.config();

const Connector = async () => {
    try{
        const connectionInsance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(connectionInsance.connection.host)
        console.log('Succefully connected to dB')
        
    }catch(error){
        console.log('Error : Connection Failed : ', error)
        process.exit(1)
    }
}

export {Connector};