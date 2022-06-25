import { BadRequestError } from "../errors/index.js";
import Job from "../models/Job.js";
import { StatusCodes } from "http-status-codes";

const index = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userId });

    res.status(StatusCodes.OK).json({
        jobs,
        totalJobs: jobs.length,
        numOfPages: 1
    });
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