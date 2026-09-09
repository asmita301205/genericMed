import { Router, Request, Response } from 'express';
import { store } from '../services/store.js';
import { ChronicSubscription } from '../types.js';

const router = Router();

// GET /api/v1/subscriptions
router.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, data: store.getSubscriptions() });
});

// POST /api/v1/subscriptions
router.post('/', (req: Request, res: Response) => {
  const subData: ChronicSubscription = req.body;
  if (!subData || !subData.id || !subData.canonicalProduct) {
    res.status(400).json({ success: false, error: 'Invalid subscription payload' });
    return;
  }
  const created = store.createSubscription(subData);
  res.status(201).json({ success: true, data: created });
});

// PATCH /api/v1/subscriptions/:id/toggle
router.patch('/:id/toggle', (req: Request, res: Response) => {
  const updated = store.toggleSubscription(req.params.id);
  if (!updated) {
    res.status(404).json({ success: false, error: 'Subscription not found' });
    return;
  }
  res.json({ success: true, data: updated });
});

// PATCH /api/v1/subscriptions/:id/interval
router.patch('/:id/interval', (req: Request, res: Response) => {
  const { intervalDays } = req.body;
  if (!intervalDays) {
    res.status(400).json({ success: false, error: 'intervalDays is required' });
    return;
  }
  const updated = store.updateSubscriptionInterval(req.params.id, intervalDays);
  if (!updated) {
    res.status(404).json({ success: false, error: 'Subscription not found' });
    return;
  }
  res.json({ success: true, data: updated });
});

// POST /api/v1/subscriptions/:id/refill
router.post('/:id/refill', (req: Request, res: Response) => {
  const updated = store.triggerSubscriptionRefill(req.params.id);
  if (!updated) {
    res.status(404).json({ success: false, error: 'Subscription not found' });
    return;
  }
  res.json({ success: true, data: updated });
});

export default router;
