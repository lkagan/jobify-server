import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from "../errors/index.js";

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
    res.status(StatusCodes.CREATED).json({user});
}

const login = (req, res) => {
    res.send('login');
}

const update = (req, res) => {
    res.send('udpate user');
}

export {register, login, update };