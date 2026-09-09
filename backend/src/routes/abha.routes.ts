import { Router, Request, Response } from 'express';
import { store } from '../services/store.js';

const router = Router();

// GET /api/v1/abha/profile
router.get('/profile', (_req: Request, res: Response) => {
  res.json({ success: true, data: store.getAbhaProfile() });
});

// PATCH /api/v1/abha/consent/:id
router.patch('/consent/:id', (req: Request, res: Response) => {
  const { status } = req.body;
  if (!status) {
    res.status(400).json({ success: false, error: 'Status is required' });
    return;
  }
  const updated = store.updateConsentStatus(req.params.id, status);
  if (!updated) {
    res.status(404).json({ success: false, error: 'Consent artifact not found' });
    return;
  }
  res.json({ success: true, data: updated });
});

export default router;
