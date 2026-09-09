import { Router, Request, Response } from 'express';
import { store } from '../services/store.js';
import { SupportTicket } from '../types.js';

const router = Router();

// GET /api/v1/tickets
router.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, data: store.getTickets() });
});

// POST /api/v1/tickets
router.post('/', (req: Request, res: Response) => {
  const ticketData: SupportTicket = req.body;
  if (!ticketData || !ticketData.id || !ticketData.subject) {
    res.status(400).json({ success: false, error: 'Invalid ticket payload' });
    return;
  }
  const created = store.createTicket(ticketData);
  res.status(201).json({ success: true, data: created });
});

// POST /api/v1/tickets/:id/reply
router.post('/:id/reply', (req: Request, res: Response) => {
  const message = req.body;
  if (!message || !message.text) {
    res.status(400).json({ success: false, error: 'Message text is required' });
    return;
  }
  const updated = store.replyTicket(req.params.id, message);
  if (!updated) {
    res.status(404).json({ success: false, error: 'Ticket not found' });
    return;
  }
  res.json({ success: true, data: updated });
});

// PATCH /api/v1/tickets/:id/resolve
router.patch('/:id/resolve', (req: Request, res: Response) => {
  const { resolutionNote, refundAmount } = req.body;
  const updated = store.resolveTicket(req.params.id, resolutionNote || 'Resolved', refundAmount);
  if (!updated) {
    res.status(404).json({ success: false, error: 'Ticket not found' });
    return;
  }
  res.json({ success: true, data: updated });
});

export default router;
