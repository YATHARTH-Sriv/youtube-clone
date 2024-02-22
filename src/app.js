import  express, { urlencoded }  from "express";
import cors from "cors"
import cookieParser from "cookie-parser";

const app=express()

app.use(cors({
    origin: process.env.CORS_ORIGIN
}))

app.use(express.urlencoded())
app.use(express.json({limit:"10kb"}))
app.use(express.static("public"))

export default app;