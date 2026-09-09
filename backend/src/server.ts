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

import { connectDB, isDbConnected } from './services/db.js';
import { store } from './services/store.js';
import {
  OrderModel,
  ListingModel,
  ProductModel,
  PrescriptionModel,
  TicketModel,
  PvpiReportModel,
  AuditLogModel
} from './models/index.js';

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
    database: isDbConnected() ? 'MongoDB Atlas (Cluster0 Connected)' : 'In-Memory Fallback Active',
    version: '1.0.0'
  });
});

// Database Live Status & Inspection Endpoint
app.get('/api/v1/db-status', async (_req: Request, res: Response) => {
  const connected = isDbConnected();
  if (!connected) {
    return res.json({
      status: 'fallback_mode',
      connected: false,
      database: 'In-memory fallback store active',
      storeOrdersCount: store.getOrders().length,
      storeListingsCount: store.getListings().length
    });
  }

  try {
    const [
      ordersCount,
      listingsCount,
      productsCount,
      rxsCount,
      ticketsCount,
      pvpiCount,
      auditsCount,
      recentOrders
    ] = await Promise.all([
      OrderModel.countDocuments(),
      ListingModel.countDocuments(),
      ProductModel.countDocuments(),
      PrescriptionModel.countDocuments(),
      TicketModel.countDocuments(),
      PvpiReportModel.countDocuments(),
      AuditLogModel.countDocuments(),
      OrderModel.find().sort({ createdAt: -1 }).limit(5).lean()
    ]);

    res.json({
      status: 'connected',
      connected: true,
      database: 'MongoDB Atlas (Cluster0)',
      databaseName: 'genericmed',
      timestamp: new Date().toISOString(),
      counts: {
        orders: ordersCount,
        listings: listingsCount,
        products: productsCount,
        prescriptions: rxsCount,
        supportTickets: ticketsCount,
        pvpiReports: pvpiCount,
        auditLogs: auditsCount
      },
      recentOrders
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
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

// Bootstrap server and connect to MongoDB Atlas
async function startServer() {
  await connectDB();
  await store.syncFromDb();

  app.listen(PORT, () => {
    console.log(`🚀 genericMed Backend API running on http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/api/v1/health`);
    console.log(`🔍 Live DB Status: http://localhost:${PORT}/api/v1/db-status`);
  });
}

startServer();
