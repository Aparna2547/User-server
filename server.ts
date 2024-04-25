import express from "express"
import router from "./src/route/userRoute"
import cors from "cors"
import cookieParser from  "cookie-parser"
import { connectDb } from "./src/config/dbConnect";
import dotenv from "dotenv"
dotenv.config()


const port = 3000

const app = express()
  connectDb()


app.use(express.json())
app.use(express.urlencoded({extended:true}))
// app.use(cors({origin:process.env.CORS_URL,credentials:true}))



app.use(cookieParser());

app.use('/api/users',router)


app.listen(port,()=>{
    console.log(`server is running on ${port}`);
    
})