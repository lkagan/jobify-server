import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from "../errors/index.js";

const register = async (req, res) => {
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
        throw new BadRequestError('Please provide all values');
    }

    let user = await User.find({email});

    if (user.length) {
        throw new BadRequestError('Email already in use');
    }

    user = await User.create({name, email, password});
    const token = user.createJWT();

    res.status(StatusCodes.CREATED).json({
        user: {
            email: user.email,
            lastName: user.lastName,
            location: user.location,
            name: user.name
        },
        token});
}

const login = async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        throw new BadRequestError('Please provide all values');
    }

    const user = await User.findOne({email}).select('+password');

    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials');
    }

    res.send('login');
}

const update = (req, res) => {
    res.send('udpate user');
}

export {register, login, update };