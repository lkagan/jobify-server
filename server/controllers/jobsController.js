import { BadRequestError } from "../errors/index.js";
import Job from "../models/Job.js";
import { StatusCodes } from "http-status-codes";

const index = (req, res) => {
    res.send('index');
}

const create = async (req, res) => {
    const { position, company } = req.body;

    if (!position || !company) {
        throw new BadRequestError('Please provide All Values');
    }

    req.body.createdBy = req.user.userId;

    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
}

const destroy = (req, res) => {
    res.send('destroy');
}

const update = (req, res) => {
    res.send('update');
}

const stats = (req, res) => {
    res.send('stats');
}

export { index, create, destroy, update, stats };