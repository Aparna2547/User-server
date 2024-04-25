import { UserModel } from "../model/UserModel";
import { Request,Response } from "express";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'

const userRegister = async (req:Request,res:Response) =>{
    try {
        console.log('body',req.body);
        
        const {firstName,lastName,password,email} = req.body 
        const userExist = await UserModel.findOne({email})
        if(userExist){
            res.status(401).json({message:"Email already exists"})
                return   
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const user = new UserModel({firstName,lastName,password:hashedPassword,email});
        await user.save();
        res.status(201).json({message:"User registerd successfully"})

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        const token =  jwt.sign({userId:user._id},process.env.JWT_SECRET,{
            expiresIn:'1d'
        })
        res.status(200).json({token})

    } catch (error) {
        res.status(500).json({ message: "Error creating user" });
    }
}

const userLogin = async(req:Request,res:Response) =>{
    try {
        const {email,password} = req.body
        if(!email || !password){
            res.status(401).json("Invalid credentials")
        }
        
        const userFound = await UserModel.findOne({email})
        if(userFound){
            const hashedPassword = userFound.password
            console.log('login hasedpasswoerd',hashedPassword);
            
            const passwordMatch = await bcrypt.compare(password,hashedPassword)
            
        }
    } catch (error) {
        res.status(500).json({ message: "Error login user" });
    }
}

export {userRegister}