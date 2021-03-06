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

    if (!await user.comparePassword(password)) {
        throw new UnauthenticatedError('Invalid Credentials');
    }

    user.password = undefined;
    res.status(StatusCodes.OK).json({
        user, token: user.createJWT(), location: user.location
    });
}

const update = async (req, res) => {
    const { email, name, lastName, location } = req.body;

    if (!email || !name || !lastName || !location) {
        throw new BadRequestError('Please provide all value');
    }

    try {
        const user = await User.findById(req.user.userId);

        user.email = email;
        user.name = name;
        user.lastName = lastName;
        user.location = location;

        await user.save();

        res.status(StatusCodes.OK).json({
            user,
            token: user.createJWT(),
            location: user.location
        });
    } catch (e) {
        console.log(e);
    }
}

export {register, login, update };