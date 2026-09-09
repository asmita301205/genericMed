# genericMed — Healthcare Marketplace (Decoupled Architecture)

genericMed is an enterprise healthcare marketplace designed to eliminate information asymmetry and clinical trust deficits in generic pharmaceuticals. The project is refactored into a fully decoupled architecture with separate **`frontend/`** and **`backend/`** subfolders.

---

## 1. Project Directory Structure

```
genericMed/
├── frontend/                     # React 19 Client SPA
│   ├── src/
│   │   ├── api/                  # Typed REST API Client with fallback resilience
│   │   │   └── client.ts
│   │   ├── components/           # 18 Modular UI components & modals
│   │   ├── data/                 # Client fallback seed fixtures
│   │   ├── utils/                # i18n & currency formatters
│   │   ├── types.ts              # Domain TypeScript definitions
│   │   ├── App.tsx               # Master state & view controller
│   │   ├── main.tsx              # React 19 entrypoint
│   │   └── index.css             # Tailwind CSS styles
│   ├── public/                   # Static icons & assets
│   ├── index.html                # Vite HTML shell
│   ├── vite.config.ts            # Vite proxy to http://localhost:5000
│   ├── tsconfig.json             # Frontend TypeScript config
│   ├── package.json              # Frontend dependencies
│   └── .env                      # Frontend environment variables
│
├── backend/                      # Node.js + Express REST API Server
│   ├── src/
│   │   ├── routes/               # Modular Express API routers
│   │   │   ├── catalog.routes.ts
│   │   │   ├── orders.routes.ts
│   │   │   ├── prescriptions.routes.ts
│   │   │   ├── subscriptions.routes.ts
│   │   │   ├── reviews.routes.ts
│   │   │   ├── batches.routes.ts
│   │   │   ├── tickets.routes.ts
│   │   │   ├── audit.routes.ts
│   │   │   ├── abha.routes.ts
│   │   │   ├── dispense.routes.ts
│   │   │   ├── pvpi.routes.ts
│   │   │   ├── erp.routes.ts
│   │   │   ├── provenance.routes.ts
│   │   │   └── epidemic.routes.ts
│   │   ├── services/             # In-memory transactional data store
│   │   │   └── store.ts
│   │   ├── data/                 # Seed datasets
│   │   ├── types.ts              # Backend domain contracts
│   │   └── server.ts             # Express server entry point
│   ├── tsconfig.json             # Backend TypeScript config (NodeNext)
│   ├── package.json              # Backend dependencies
│   └── .env                      # Backend environment variables
│
├── package.json                  # Root monorepo orchestration scripts
├── README.md                     # Project documentation & execution guide
├── .gitignore                    # Root git exclusions
├── decisions.md                  # Architecture Decision Records (ADRs 001–023)
├── rules.md                      # AI coding standards & operating rules
├── memory.md                     # System memory, schemas & roadmap
├── changelog.md                  # Project version changelog
└── phases.md                     # Complete 5-phase lifecycle architecture
```

---

## 2. Environment Variables

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_PORT=3000
```

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

## 3. Installation Instructions

### Option A: Install All Dependencies (Single Command from Root)
```bash
npm run install:all
```

### Option B: Install Independently

#### 1. Installing Backend Dependencies
```bash
cd backend
npm install
```

#### 2. Installing Frontend Dependencies
```bash
cd frontend
npm install
```

---

## 4. Starting the Application

### Option A: Running Both Together (Recommended)
From the project root:
```bash
npm run dev
```
This concurrently starts:
- **Backend API**: `http://localhost:5000`
- **Frontend UI**: `http://localhost:3000`

### Option B: Running Independently

#### 1. Starting the Backend Server
```bash
cd backend
npm run dev
```
- Server launches on: `http://localhost:5000`
- Health check: `http://localhost:5000/api/v1/health`
- Live reload enabled via `tsx watch`.

#### 2. Starting the Frontend Client
```bash
cd frontend
npm run dev
```
- Client launches on: `http://localhost:3000`
- Vite development proxy automatically routes `/api` requests to `http://localhost:5000`.

---

## 5. Production Build Verification

### Build Both Services
```bash
npm run build
```

### Build Services Individually
```bash
# Backend TypeScript compilation:
cd backend && npm run build

# Frontend production bundling:
cd frontend && npm run build
```

---

## 6. REST API Endpoint Catalog

| Service | Method & Route | Description |
| :--- | :--- | :--- |
| **System** | `GET /api/v1/health` | Health check and uptime |
| **Catalog** | `GET /api/v1/catalog/products` | Retrieve all canonical products |
| **Catalog** | `GET /api/v1/catalog/listings` | Retrieve partner medicine listings |
| **Catalog** | `PATCH /api/v1/catalog/listings/:id/stock` | Update partner stock quantity |
| **Catalog** | `PATCH /api/v1/catalog/listings/:id/price` | Update partner pack price |
| **Orders** | `GET /api/v1/orders` | Retrieve order history |
| **Orders** | `POST /api/v1/orders` | Place verified order with idempotency |
| **Orders** | `PATCH /api/v1/orders/:id/status` | Update fulfillment state |
| **Cart** | `POST /api/v1/orders/cart/revalidate` | Validate live stock and prices |
| **Prescriptions** | `GET /api/v1/prescriptions` | Retrieve prescription records |
| **Prescriptions** | `POST /api/v1/prescriptions` | Upload OCR-parsed prescription |
| **Subscriptions** | `GET /api/v1/subscriptions` | Chronic 30/60/90-day auto-refills |
| **Subscriptions** | `POST /api/v1/subscriptions` | Create new refill subscription |
| **Subscriptions** | `PATCH /api/v1/subscriptions/:id/toggle` | Pause or resume subscription |
| **Subscriptions** | `POST /api/v1/subscriptions/:id/refill` | Trigger instant dispatch refill |
| **Reviews** | `GET /api/v1/reviews` | Retrieve patient reviews |
| **Reviews** | `POST /api/v1/reviews` | Submit verified patient review |
| **Batches** | `GET /api/v1/batches` | Batch expiry and cold-chain radar |
| **Batches** | `PATCH /api/v1/batches/:id/status` | Quarantine recalled batch |
| **Disputes** | `GET /api/v1/tickets` | Support desk tickets |
| **Disputes** | `POST /api/v1/tickets` | File dispute ticket |
| **Disputes** | `PATCH /api/v1/tickets/:id/resolve` | Issue refund and resolve case |
| **Audit** | `GET /api/v1/audit` | Section 18 immutable audit trail |
| **Audit** | `POST /api/v1/audit` | Append event to statutory ledger |
| **ABHA** | `GET /api/v1/abha/profile` | 14-digit ABHA ID & KYC profile |
| **ABHA** | `PATCH /api/v1/abha/consent/:id` | Update ABDM electronic consent |
| **Rule 65** | `GET /api/v1/dispense` | Two-pharmacist QC dispense records |
| **Rule 65** | `POST /api/v1/dispense` | Authorize dispense with tamper seal |
| **PvPI** | `GET /api/v1/pvpi` | Adverse drug reaction yellow forms |
| **PvPI** | `POST /api/v1/pvpi` | File ADR report to IPC/CDSCO |
| **ERP** | `GET /api/v1/erp/connectors` | National pharmacy ERP bridges |
| **ERP** | `POST /api/v1/erp/sync` | Trigger delta SKU sync |
| **Provenance** | `GET /api/v1/provenance/ledger` | 6-block SHA-256 provenance hash chain |
| **Epidemic** | `GET /api/v1/epidemic/signals` | IDSP regional disease surge heatmap |
| **Epidemic** | `GET /api/v1/epidemic/bioequivalence` | Pharmacokinetic $AUC/C_{max}$ metrics |

---

## 7. Architectural Governance & Persistence

All architecture and technical decisions are tracked in:
- [`decisions.md`](./decisions.md): Architecture Decision Records (including ADR-023: Full Frontend-Backend Decoupling).
- [`rules.md`](./rules.md): AI operating rules, coding standards, and folder structure.
- [`memory.md`](./memory.md): Long-term memory, database schemas, and mathematical ranking logic.
- [`changelog.md`](./changelog.md): Release version history.
- [`phases.md`](./phases.md): 5-phase lifecycle and technical specification matrix.
