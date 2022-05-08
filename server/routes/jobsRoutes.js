import express from 'express';
import * as jobs from '../controllers/jobsController.js';

const router = express.Router();

router.route('/').get(jobs.index);
router.route('/').post(jobs.create);
router.route('/:id').patch(jobs.update);
router.route('/:id').delete(jobs.destroy);
router.route('/stats').get(jobs.stats);

export default router;
