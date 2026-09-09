import { Router, Request, Response } from 'express';
import { store } from '../services/store.js';

const router = Router();

// GET /api/v1/batches
router.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, data: store.getBatches() });
});

// PATCH /api/v1/batches/:id/status
router.patch('/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  if (!status) {
    res.status(400).json({ success: false, error: 'Status is required' });
    return;
  }
  const updated = store.updateBatchStatus(req.params.id, status);
  if (!updated) {
    res.status(404).json({ success: false, error: 'Batch not found' });
    return;
  }
  res.json({ success: true, data: updated });
});

export default router;
