import { Router, Request, Response } from 'express';
import { store } from '../services/store.js';

const router = Router();

// GET /api/v1/audit
router.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, data: store.getAuditLogs() });
});

// POST /api/v1/audit
router.post('/', (req: Request, res: Response) => {
  const auditData = req.body;
  if (!auditData || !auditData.actionType) {
    res.status(400).json({ success: false, error: 'actionType is required' });
    return;
  }
  const created = store.appendAudit(auditData);
  res.status(201).json({ success: true, data: created });
});

export default router;
