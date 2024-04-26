import { UserModel } from "../model/UserModel";
import { Request, Response } from "express";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import genOtp from "../utils/generateOtp";
import sendMail from "../utils/sendMail";
import { log } from "console";

const userRegister = async (req: Request, res: Response) => {
  try {
    console.log("body", req.body);

    const { firstName, lastName, password, email } = req.body;
    const userExist = await UserModel.findOne({ email });
    console.log(userExist);

    if (userExist) {
      res.status(401).json({ message: "Email already exists" });
      return;
    } else {
      req.app.locals.user = { firstName, lastName, password, email };
      const otp = await genOtp(4);
      console.log("otp", otp);
      console.log("otp df",  req.app.locals.otp );
      req.app.locals.otp = otp;
      console.log("dkjf", req.app.locals.user, req.app.locals.otp);

      const mailDetails = await sendMail(firstName, email, otp);
      console.log("mail", mailDetails);

      res.status(200).json();
    }
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};

const verifyOtp = async (req: Request, res: Response) => {
  try {
    console.log('controller')
    const otpBody: string = req.body.otp;
    console.log("otpbody", otpBody);
    const otpSaved: string = req.app.locals.otp;
    console.log("otpsaved", otpSaved);

    if (otpBody === otpSaved) {
      const userDetails = req.app.locals.user;
      console.log("user", userDetails);
      const hashedPassword = await bcrypt.hash(userDetails.password, 10);
      userDetails.password = hashedPassword;
      const user = new UserModel(userDetails);
      await user.save();
    //   res.status(201).json({ message: "User registerd successfully" });

      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
      }

    //   const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    //     expiresIn: "1d",
    //   });


      res.status(201).json({
        message: "User registered successfully",
        token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        })
      });
      
    }
  } catch (error) {
    res.status(401).json({ message: "Something error on signing up" });
  }
};

const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log('email',email);
    
    if (!email || !password) {
      res.status(401).json("Invalid credentials");
    }

    const userFound = await UserModel.findOne({ email });
    console.log('userfounf',userFound);
    
    if (userFound) {
      const hashedPassword = userFound.password;
      console.log("login hasedpasswoerd", hashedPassword);
      const passwordMatch = await bcrypt.compare(password, hashedPassword);
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
      }
      if (passwordMatch) {
        const token = jwt.sign(
          { userId: userFound._id },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );
        res.status(201).json({ message: "Logined successfully", token });
      }else{
        console.log('invalid credentials')
        res.status(401).json({message:"Invalid credentials"})
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Error login user" });
  }
};

const changePassword = async (req:Request,res:Response) =>{
  try {
    console.log('koio');
    
    
    const {password,newPassword} = req.body
    const token = req.headers.token as string 
    console.log('user,',token)
    if(token){
      const decoded:any = jwt.verify(token,process.env.JWT_SECRET as string)
      const userId = decoded.userId
      console.log('userid',userId)

      const user = await UserModel.findOne({_id:userId})
      if(user){
        console.log('user',user.password as string)
        const passwordMatch =await bcrypt.compare(password,user.password)
        console.log('pas',passwordMatch);
        if(!passwordMatch){
           return res.status(401).json({message:"Password is not matched. Please try again"})
        }else{
          const hasedpassword = await bcrypt.hash(newPassword,10)
          await UserModel.updateOne({_id:userId},{
            $set:{password:hasedpassword}
          })
        }
        console.log('completed');
        res.status(200).json({message:"Password changed successully"})
        
        
        
      }
   

    }
    } catch (error) {
    res.status(500).json({message:"Error while changing password"})
  }
}


const dashboard = async (req:Request,res:Response) =>{
  try {
    const  token = req.headers.token  as string;
    console.log('user,',token)
    if(token){
      const decoded:any = jwt.verify(token,process.env.JWT_SECRET as string)
      const userId = decoded.userId
      console.log('userid',userId)

      const user = await UserModel.findOne({_id:userId})
      res.status(200).json(user)
    }
  } catch (error) {
    res.status(401).json({message:"Error while loading"})
  }
}
export { userRegister,verifyOtp, userLogin ,changePassword ,dashboard};
