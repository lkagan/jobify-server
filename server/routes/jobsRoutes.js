import express from 'express';
import * as jobs from '../controllers/jobsController.js';

const router = express.Router();

router.route('/')
    .get(jobs.index)
    .post(jobs.create);

router.route('/stats').get(jobs.stats);

router.route('/:id')
    .delete(jobs.destroy)
    .patch(jobs.update);

export default router;
