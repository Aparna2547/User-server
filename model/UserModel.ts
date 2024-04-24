import mongoose,{Schema} from 'mongoose'


interface User{
    firstName:string,
    lastName:string,
    password:string,
    email: string
}
const userSchema : Schema<User> = new mongoose.Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    password:{
        type:String
    },
    email:{
        type:String
    }
})

const UserModel = mongoose.model<User>('user',userSchema)
export {UserModel}