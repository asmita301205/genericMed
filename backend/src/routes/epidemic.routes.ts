import { Router, Request, Response } from 'express';
import { store } from '../services/store.js';

const router = Router();

// GET /api/v1/epidemic/signals
router.get('/signals', (_req: Request, res: Response) => {
  res.json({ success: true, data: store.getEpidemicSignals() });
});

// GET /api/v1/epidemic/bioequivalence
router.get('/bioequivalence', (_req: Request, res: Response) => {
  res.json({ success: true, data: store.getBioequivalenceMetrics() });
});

export default router;
