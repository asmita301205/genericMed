import { Router, Request, Response } from 'express';
import { store } from '../services/store.js';
import { PrescriptionRecord } from '../types.js';

const router = Router();

// GET /api/v1/prescriptions
router.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, data: store.getPrescriptions() });
});

// POST /api/v1/prescriptions
router.post('/', (req: Request, res: Response) => {
  const rxData: PrescriptionRecord = req.body;
  if (!rxData || !rxData.id || !rxData.patientName) {
    res.status(400).json({ success: false, error: 'Invalid prescription payload' });
    return;
  }
  const created = store.addPrescription(rxData);
  res.status(201).json({ success: true, data: created });
});

export default router;
