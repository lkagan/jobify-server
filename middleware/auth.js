import { UnauthenticatedError } from "../errors/index.js";
import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer')) {
        throw new UnauthenticatedError('Authentication Invalid');
    }

    try {
        req.user = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        next();
    } catch (e) {
        throw new UnauthenticatedError('Authentication invalid');
    }
}

export default auth;