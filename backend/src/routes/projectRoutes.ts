import { Router } from 'express';
import { getProject } from '../controllers/projectController';

const router = Router();
router.get('/', getProject);

export default router;
