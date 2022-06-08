import { UnauthenticatedError } from "../errors/index.js";

const auth = async (req, res, next) => {
    if (!req.headers.authorization) {
        throw new UnauthenticatedError('Authentication Invalid');
    }
    
    next();
}

export default auth;