import express from "express";
import {register, login, update} from '../controllers/authController.js';
import authenticateUser from '../middleware/auth.js'
import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
    windowMs: 60 * 1000 ,
    max: 10,
    message: 'Too many requests,  Please try again later.'
});

const router = express.Router();


router.route('/register').post(apiLimiter, register);
router.route('/login').post(apiLimiter, login);
router.route('/update').patch(authenticateUser, update);

export default router;
