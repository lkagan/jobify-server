import { BadRequestError, NotFoundError } from "../errors/index.js";
import Job from "../models/Job.js";
import { StatusCodes } from "http-status-codes";
import checkPermissions from "../utils/checkPermissions.js";
import mongoose from 'mongoose';
import moment from 'moment';

const index = async (req, res) => {
    const { search, status, jobType, sort } = req.query;

    const queryObject = {
        createdBy: req.user.userId
    }

    status && status !== 'all' && (queryObject.status = status);
    jobType && jobType !== 'all' && (queryObject.jobType = jobType);
    search && (queryObject.position = { $regex: search, $options: 'i' });

    let result = Job.find(queryObject);

    const jobs = await result;

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

    if (!job) {
        throw new NotFoundError(`No job with id: ${ jobId }`);
    }

    checkPermissions(req.user, job.createdBy);

    await job.remove();
    res.status(StatusCodes.OK).json({ msg: 'Success! Job removed' });
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

const stats = async (req, res) => {
    let stats = await Job.aggregate([
        { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const defaultStats = { pending: 0, interview: 0, declined: 0 };

    stats = stats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
    }, defaultStats);

    let monthlyApplications = await Job.aggregate([
        { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
        {
            $group: {
                _id: {
                    year: {
                        $year: '$createdAt',
                    },
                    month: {
                        $month: '$createdAt',
                    },
                },
                count: { $sum: 1 },
            }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 },
    ]);

    monthlyApplications = monthlyApplications.map((item) => {
        const { _id: { year, month }, count } = item;
        const date = moment().month(month - 1).year(year).format('MMM Y');
        return { date, count };
    }).reverse();

    res.status(StatusCodes.OK).json({ stats, monthlyApplications });
}

export { index, create, destroy, update, stats };