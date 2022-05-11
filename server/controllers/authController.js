import User from '../models/User.js';

const register = async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({user});
    } catch (e) {
        console.log(e);
        next(e);
    }
}

const login = (req, res) => {
    res.send('login');
}

const update = (req, res) => {
    res.send('udpate user');
}

export {register, login, update };