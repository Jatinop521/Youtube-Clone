import dotenv from "dotenv";
import { app } from "./app.js";
dotenv.config();

import { Connector } from "./db/index.js";

let port = process.env.PORT || 8000;

Connector()
.then(() => {
    app.on('error', (error) => {
        console.log('Error Occred in loading app in index.js' , error)
        throw error;
    }
    )
    app.listen(port , () => {
        console.log('App is running on port : ' ,port )
    })
}
)
.catch((e) => console.log('Error Occured In the Connector ' , e));