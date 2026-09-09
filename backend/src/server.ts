import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import catalogRoutes from './routes/catalog.routes.js';
import ordersRoutes from './routes/orders.routes.js';
import prescriptionsRoutes from './routes/prescriptions.routes.js';
import subscriptionsRoutes from './routes/subscriptions.routes.js';
import reviewsRoutes from './routes/reviews.routes.js';
import batchesRoutes from './routes/batches.routes.js';
import ticketsRoutes from './routes/tickets.routes.js';
import auditRoutes from './routes/audit.routes.js';
import abhaRoutes from './routes/abha.routes.js';
import dispenseRoutes from './routes/dispense.routes.js';
import pvpiRoutes from './routes/pvpi.routes.js';
import erpRoutes from './routes/erp.routes.js';
import provenanceRoutes from './routes/provenance.routes.js';
import epidemicRoutes from './routes/epidemic.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middleware
app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Request Logger
app.use((req, _res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check
app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'genericMed Enterprise REST API',
    version: '1.0.0'
  });
});

// API Routes Mounting
app.use('/api/v1/catalog', catalogRoutes);
app.use('/api/v1/orders', ordersRoutes);
app.use('/api/v1/prescriptions', prescriptionsRoutes);
app.use('/api/v1/subscriptions', subscriptionsRoutes);
app.use('/api/v1/reviews', reviewsRoutes);
app.use('/api/v1/batches', batchesRoutes);
app.use('/api/v1/tickets', ticketsRoutes);
app.use('/api/v1/audit', auditRoutes);
app.use('/api/v1/abha', abhaRoutes);
app.use('/api/v1/dispense', dispenseRoutes);
app.use('/api/v1/pvpi', pvpiRoutes);
app.use('/api/v1/erp', erpRoutes);
app.use('/api/v1/provenance', provenanceRoutes);
app.use('/api/v1/epidemic', epidemicRoutes);

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: express.NextFunction) => {
  console.error('[Unhandled Error]:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 genericMed Backend API running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/v1/health`);
});
