import { Router, Request, Response } from 'express';
import { store } from '../services/store.js';

const router = Router();

// GET /api/v1/erp/connectors
router.get('/connectors', (_req: Request, res: Response) => {
  res.json({ success: true, data: store.getErpConnectors() });
});

// POST /api/v1/erp/sync
router.post('/sync', (req: Request, res: Response) => {
  const { connectorId } = req.body;
  if (!connectorId) {
    res.status(400).json({ success: false, error: 'connectorId is required' });
    return;
  }
  const updated = store.syncErpConnector(connectorId);
  if (!updated) {
    res.status(404).json({ success: false, error: 'Connector not found' });
    return;
  }
  res.json({ success: true, data: updated });
});

export default router;
