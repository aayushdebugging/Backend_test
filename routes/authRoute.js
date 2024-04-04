import express from 'express'
import { loginController, registerController } from '../controller/authoController.js'

//router object
const router = express.Router()


//routes


//REGISTER || POST
router.post('/register', registerController)

//lOGIN|| POST
router.post('/login',loginController)

//export
export default router
