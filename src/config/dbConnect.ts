import mongoose from "mongoose"

export const connectDb = async () =>{
    try {
        const uri = process.env.mongo_uri as string;
        // console.log(uri)
        await mongoose.connect(uri)
console.log('connected to db');

    } catch (error) {
        console.log(error);
        
    }
}