import { Router, Request, Response } from 'express';
import { store } from '../services/store.js';

const router = Router();

// GET /api/v1/catalog/products
router.get('/products', (_req: Request, res: Response) => {
  res.json({ success: true, data: store.getProducts() });
});

// GET /api/v1/catalog/products/:id
router.get('/products/:id', (req: Request, res: Response) => {
  const product = store.getProductById(req.params.id);
  if (!product) {
    res.status(404).json({ success: false, error: 'Product not found' });
    return;
  }
  res.json({ success: true, data: product });
});

// GET /api/v1/catalog/listings
router.get('/listings', (_req: Request, res: Response) => {
  res.json({ success: true, data: store.getListings() });
});

// PATCH /api/v1/catalog/listings/:id/stock
router.patch('/listings/:id/stock', (req: Request, res: Response) => {
  const { stockCount } = req.body;
  if (typeof stockCount !== 'number') {
    res.status(400).json({ success: false, error: 'stockCount must be a number' });
    return;
  }
  const updated = store.updateListingStock(req.params.id, stockCount);
  if (!updated) {
    res.status(404).json({ success: false, error: 'Listing not found' });
    return;
  }
  res.json({ success: true, data: updated });
});

// PATCH /api/v1/catalog/listings/:id/price
router.patch('/listings/:id/price', (req: Request, res: Response) => {
  const { packPrice } = req.body;
  if (typeof packPrice !== 'number') {
    res.status(400).json({ success: false, error: 'packPrice must be a number' });
    return;
  }
  const updated = store.updateListingPrice(req.params.id, packPrice);
  if (!updated) {
    res.status(404).json({ success: false, error: 'Listing not found' });
    return;
  }
  res.json({ success: true, data: updated });
});

export default router;
