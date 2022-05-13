import User from '../models/User.js';
import {StatusCodes} from 'http-status-codes';

class CustomAPIError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

const register = async (req, res) => {
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
        throw new CustomAPIError('Please provide all values');
    }

    const user = await User.create({name, email, password});
    res.status(StatusCodes.CREATED).json({user});
}

const login = (req, res) => {
    res.send('login');
}

const update = (req, res) => {
    res.send('udpate user');
}

export {register, login, update };