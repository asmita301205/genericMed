import { Router, Request, Response } from 'express';
import { store } from '../services/store.js';
import { PvPiAdverseReactionReport } from '../types.js';

const router = Router();

// GET /api/v1/pvpi
router.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, data: store.getPvpiReports() });
});

// POST /api/v1/pvpi
router.post('/', (req: Request, res: Response) => {
  const reportData = req.body;
  if (!reportData || !reportData.medicineName) {
    res.status(400).json({ success: false, error: 'medicineName is required' });
    return;
  }
  const report: PvPiAdverseReactionReport = {
    ...reportData,
    id: `PVPI-IND-${Date.now().toString().slice(-4)}`,
    ipcSubmissionStatus: 'Submitted_to_PvPI',
    filedAt: 'Just now'
  };
  const created = store.addPvpiReport(report);
  res.status(201).json({ success: true, data: created });
});

export default router;
