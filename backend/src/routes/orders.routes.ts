import { Router, Request, Response } from 'express';
import { store } from '../services/store.js';
import { OrderRecord } from '../types.js';

const router = Router();

// GET /api/v1/orders
router.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, data: store.getOrders() });
});

// GET /api/v1/orders/:id
router.get('/:id', (req: Request, res: Response) => {
  const order = store.getOrderById(req.params.id);
  if (!order) {
    res.status(404).json({ success: false, error: 'Order not found' });
    return;
  }
  res.json({ success: true, data: order });
});

// POST /api/v1/orders
router.post('/', (req: Request, res: Response) => {
  const orderData: OrderRecord = req.body;
  if (!orderData || !orderData.id || !orderData.items) {
    res.status(400).json({ success: false, error: 'Invalid order payload' });
    return;
  }
  const created = store.createOrder(orderData);
  res.status(201).json({ success: true, data: created });
});

// PATCH /api/v1/orders/:id/status
router.patch('/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  if (!status) {
    res.status(400).json({ success: false, error: 'Status is required' });
    return;
  }
  const updated = store.updateOrderStatus(req.params.id, status);
  if (!updated) {
    res.status(404).json({ success: false, error: 'Order not found' });
    return;
  }
  res.json({ success: true, data: updated });
});

// POST /api/v1/orders/cart/revalidate
router.post('/cart/revalidate', (req: Request, res: Response) => {
  const { items } = req.body; // array of { listingId, quantity }
  if (!Array.isArray(items)) {
    res.status(400).json({ success: false, error: 'items must be an array' });
    return;
  }

  const listings = store.getListings();
  const discrepancies: Array<{
    listingId: string;
    type: 'stock_shortage' | 'price_change' | 'stale_listing';
    availableStock: number;
    currentPrice: number;
  }> = [];

  for (const item of items) {
    const listing = listings.find(l => l.id === item.listingId);
    if (!listing) {
      discrepancies.push({
        listingId: item.listingId,
        type: 'stale_listing',
        availableStock: 0,
        currentPrice: 0
      });
    } else if (listing.stockCount < item.quantity) {
      discrepancies.push({
        listingId: item.listingId,
        type: 'stock_shortage',
        availableStock: listing.stockCount,
        currentPrice: listing.packPrice
      });
    }
  }

  res.json({
    success: true,
    data: {
      isValid: discrepancies.length === 0,
      discrepancies
    }
  });
});

export default router;
