import User from '../models/User.js';
import {StatusCodes} from 'http-status-codes';

const register = async (req, res) => {
    const user = await User.create(req.body);
    res.status(StatusCodes.CREATED).json({user});
}

const login = (req, res) => {
    res.send('login');
}

const update = (req, res) => {
    res.send('udpate user');
}

export {register, login, update };