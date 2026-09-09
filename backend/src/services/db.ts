import mongoose from 'mongoose';
import {
  ProductModel,
  ListingModel,
  OrderModel,
  PrescriptionModel,
  SubscriptionModel,
  ReviewModel,
  BatchModel,
  TicketModel,
  AuditLogModel,
  AbhaProfileModel,
  DualDispenseModel,
  PvpiReportModel,
  ErpConnectorModel,
  ProvenanceModel,
  EpidemicSignalModel
} from '../models/index.js';

import {
  CANONICAL_PRODUCTS,
  PRODUCT_LISTINGS,
  INITIAL_ORDERS,
  INITIAL_AUDIT_LOGS,
  SAMPLE_PRESCRIPTIONS,
  SAMPLE_SUBSCRIPTIONS,
  SAMPLE_REVIEWS,
  SAMPLE_BATCH_RECORDS,
  SAMPLE_SUPPORT_TICKETS,
  NATIONAL_ERP_CONNECTORS,
  SAMPLE_ABHA_PROFILE,
  SAMPLE_DUAL_DISPENSES,
  SAMPLE_PVPI_REPORTS,
  SAMPLE_PROVENANCE_LEDGER,
  SAMPLE_EPIDEMIC_SIGNALS
} from '../data/genericMedData.js';

let isConnected = false;

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URL || process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️ [MongoDB] Neither MONGODB_URL nor MONGODB_URI configured in .env. Running with in-memory store.');
    return;
  }

  try {
    console.log('⏳ [MongoDB] Connecting to MongoDB Atlas Cluster0...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000
    });

    isConnected = true;
    console.log('✅ [MongoDB] Successfully connected to MongoDB Atlas (Cluster0)! Database: genericmed');

    // Run initial seed if database collections are empty
    await seedInitialDataIfEmpty();
  } catch (err) {
    isConnected = false;
    console.warn('⚠️ [MongoDB] Connection error, activating in-memory fallback mode:', (err as Error).message);
  }

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.warn('⚠️ [MongoDB] Disconnected from MongoDB Atlas. Fallback mode active.');
  });

  mongoose.connection.on('reconnected', () => {
    isConnected = true;
    console.log('✅ [MongoDB] Reconnected to MongoDB Atlas!');
  });
}

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

async function seedInitialDataIfEmpty(): Promise<void> {
  try {
    const productCount = await ProductModel.countDocuments();
    if (productCount === 0) {
      console.log('🌱 [MongoDB] Empty database detected. Seeding initial marketplace datasets...');

      await Promise.all([
        ProductModel.insertMany(CANONICAL_PRODUCTS),
        ListingModel.insertMany(PRODUCT_LISTINGS),
        OrderModel.insertMany(INITIAL_ORDERS),
        PrescriptionModel.insertMany(SAMPLE_PRESCRIPTIONS),
        SubscriptionModel.insertMany(SAMPLE_SUBSCRIPTIONS),
        ReviewModel.insertMany(SAMPLE_REVIEWS),
        BatchModel.insertMany(SAMPLE_BATCH_RECORDS),
        TicketModel.insertMany(SAMPLE_SUPPORT_TICKETS),
        AuditLogModel.insertMany(INITIAL_AUDIT_LOGS),
        AbhaProfileModel.create(SAMPLE_ABHA_PROFILE),
        DualDispenseModel.insertMany(SAMPLE_DUAL_DISPENSES),
        PvpiReportModel.insertMany(SAMPLE_PVPI_REPORTS),
        ErpConnectorModel.insertMany(NATIONAL_ERP_CONNECTORS),
        ProvenanceModel.insertMany(SAMPLE_PROVENANCE_LEDGER),
        EpidemicSignalModel.insertMany(SAMPLE_EPIDEMIC_SIGNALS)
      ]);

      console.log('✨ [MongoDB] Seed complete! Canonical products, listings, and clinical records seeded.');
    } else {
      console.log(`📦 [MongoDB] Database verified: ${productCount} canonical products present.`);
    }
  } catch (err) {
    console.error('❌ [MongoDB] Seeding error:', err);
  }
}
