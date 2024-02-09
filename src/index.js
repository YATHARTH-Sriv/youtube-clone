import dotenv from "dotenv";
import mongoose from "mongoose";
import DB_Name from "./constants.js";
import express from "express";

dotenv.config({
    path: "./env"
})
const app=express();
const connection= async()=>{
     try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)
        app.get('/', (req, res) => {
            res.send('Hello World!')
            console.log("connection suceeded")
            console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
          })
          
          app.listen(process.env.PORT || 3000, () => {
            console.log(`Example app listening on port`)
          })
        console.log("connection suceeded")
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
     }
    catch (error) {
        console.log("error in index.js file",error);
        
     }
    }
    
    


    // require('dotenv').config({path: './env'})
/*import dotenv from "dotenv"
import connectDB from "./db/connect.js";
import express from "express";
dotenv.config({
    path: './.env'
})

const app=express();



connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(` Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})
*/



/*import express from "express"
const app = express()
( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("errror", (error) => {
            console.log("ERRR: ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("ERROR: ", error)
        throw err
    }
})()
*/
