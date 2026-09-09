import { Router, Request, Response } from 'express';
import { store } from '../services/store.js';
import { ProductReview } from '../types.js';

const router = Router();

// GET /api/v1/reviews
router.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, data: store.getReviews() });
});

// POST /api/v1/reviews
router.post('/', (req: Request, res: Response) => {
  const reviewData: ProductReview = req.body;
  if (!reviewData || !reviewData.productId || !reviewData.comment) {
    res.status(400).json({ success: false, error: 'Invalid review payload' });
    return;
  }
  const created = store.createReview(reviewData);
  res.status(201).json({ success: true, data: created });
});

// PATCH /api/v1/reviews/:id/moderate
router.patch('/:id/moderate', (req: Request, res: Response) => {
  const { status } = req.body;
  if (!['approved', 'flagged', 'hidden'].includes(status)) {
    res.status(400).json({ success: false, error: 'Valid status is required' });
    return;
  }
  const updated = store.moderateReview(req.params.id, status);
  if (!updated) {
    res.status(404).json({ success: false, error: 'Review not found' });
    return;
  }
  res.json({ success: true, data: updated });
});

export default router;
