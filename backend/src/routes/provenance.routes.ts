import { Router, Request, Response } from 'express';
import { store } from '../services/store.js';

const router = Router();

// GET /api/v1/provenance/ledger
router.get('/ledger', (_req: Request, res: Response) => {
  res.json({ success: true, data: store.getProvenanceLedger() });
});

export default router;
