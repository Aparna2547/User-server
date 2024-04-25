import jwt from "jsonwebtoken"
import { Request,Response,NextFunction } from "express";

const verifyToken  =async (req:Request,res:Response,next:NextFunction) =>{
    const  token : string | undefined= req.header("Authorization") ;
    try {
    if (!token) {
        return res.status(401).json({ error: "Invalid token" });
    }
   
        const decoded:any = jwt.verify(token,process.env.JWT_SECRET as string)
        console.log('decoded',decoded);
        
        next()
    } catch (error) {
        res.status(401).json({error:"Invalid token"})
    }
}
export default verifyToken