import express from "express"
import { changePassword, dashboard, userLogin, userRegister, verifyOtp } from "../controller/userController"
import verifyToken from "../middleware/protect"
const router = express.Router()


router.post('/register',userRegister)
router.post('/verifyOtp',verifyOtp)
router.post('/',userLogin)
router.post('/changePassword',verifyToken,changePassword)
router.get('/home',verifyToken,dashboard)

export default router