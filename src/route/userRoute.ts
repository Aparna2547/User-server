import express from "express"
import { userRegister } from "../controller/userController"
const router = express.Router()


router.post('/register',userRegister)
// router.post('/',loginUser)
router.get('/home')

export default router