import { Router } from 'express';
import {
  getPlots,
  getPlotByIdentifier,
  updatePlot,
  getPlotStats
} from '../controllers/plotController';

const router = Router();

router.get('/', getPlots);
router.get('/stats', getPlotStats);
router.get('/:identifier', getPlotByIdentifier);
router.patch('/:identifier', updatePlot);
router.put('/:identifier', updatePlot);

export default router;
