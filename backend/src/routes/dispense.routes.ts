import { Router, Request, Response } from 'express';
import { store } from '../services/store.js';
import { DualPharmacistDispenseRecord } from '../types.js';

const router = Router();

// GET /api/v1/dispense
router.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, data: store.getDualDispenses() });
});

// POST /api/v1/dispense
router.post('/', (req: Request, res: Response) => {
  const record: DualPharmacistDispenseRecord = req.body;
  if (!record || !record.id || !record.orderId) {
    res.status(400).json({ success: false, error: 'Invalid dispense record payload' });
    return;
  }
  const created = store.addDualDispense(record);
  // Also update corresponding order status
  store.updateOrderStatus(record.orderId, 'Completed');
  res.status(201).json({ success: true, data: created });
});

export default router;
