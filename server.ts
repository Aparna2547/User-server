import express from "express"
import router from "./route/userRoute"
import cors from "cors"
import cookieParser from  "cookie-parser"
import http from "http";


const port = 3000

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(
    cors({
        origin:'http://localhost:3000',
        methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials:true
    })
)

app.use(cookieParser());

app.use('/api/users',router)

app.listen(port,()=>{
    `server is running on ${port}`
})