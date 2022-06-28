import { BadRequestError, NotFoundError } from "../errors/index.js";
import Job from "../models/Job.js";
import { StatusCodes } from "http-status-codes";
import checkPermissions from "../utils/checkPermissions.js";

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

const destroy = async (req, res) => {
    const { id: jobId } = req.params;

    const job = await Job.findOne({ _id: jobId });

    if (! job) {
        throw new NotFoundError(`No job with id: ${jobId}`);
    }

    checkPermissions(req.user, job.createdBy);

    await job.remove();
    res.status(StatusCodes.OK).json({msg: 'Success! Job removed' });
}

const update = async (req, res) => {
    const { id: jobId } = req.params;
    const { company, position } = req.body;

    if (!company || !position) {
        throw new BadRequestError('Please provide all values');
    }

    const job = await Job.findOne({ _id: jobId });

    if (!job) {
        throw new NotFoundError(`No job with id ${ jobId }`);
    }

    checkPermissions(req.user, job.createdBy);

    const updatedJob = await Job.findOneAndUpdate(
        { _id: jobId },
        req.body,
        { new: true, runValidators: true }
    );

    res.status(StatusCodes.OK).json({ updatedJob });
}

const stats = (req, res) => {
    res.send('stats');
}

export { index, create, destroy, update, stats };