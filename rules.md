# AI Engineering & Operating Rules

This document establishes the mandatory rules, technical conventions, architecture patterns, and behavioral constraints that every AI coding assistant and engineer **must strictly obey** when contributing to **genericMed**.

---

## Quick Reference Checklist

- [ ] **TypeScript Strict**: Zero `any` types; all domain entities must use contracts from `src/types.ts`.
- [ ] **Clinical Boundary**: Never soften, hallucinate, or bypass hard clinical constraints (salt, strength, form).
- [ ] **Unit Pricing**: Always preserve and display `normalizedUnitPrice` (₹/unit) as the primary comparison metric.
- [ ] **Component Purity**: Stateless UI components with explicit props; business logic separated into hooks or utility modules.
- [ ] **No Regression**: Never delete or break existing exported components, types, or user workflows without explicit instruction.
- [ ] **Security First**: Zero hardcoded secrets, API keys, or personal health information in client bundles.
- [ ] **Atomic Commits**: Follow Conventional Commits format (`feat:`, `fix:`, `refactor:`, `docs:`, etc.).

---

## 1. Coding Standards

### 1.1 TypeScript & Type Safety
1. **Strict Type Checking**: TypeScript strict mode is enabled. Do **not** disable `strict` checks or use `// @ts-ignore` / `// @ts-nocheck` unless accompanied by a critical explanatory comment.
2. **Eliminate `any`**: Explicitly type all variables, function arguments, state variables, and return types. Use `unknown` with type guards if the type is uncertain.
3. **Canonical Domain Types**: All domain models (`CanonicalProduct`, `ProductListing`, `OrderRecord`, `AuditRecord`, `OperationalException`, `AppScreen`, etc.) must be imported directly from `src/types.ts`. Do not redefine duplicate interfaces locally inside components.
4. **Readonly & Immutable Patterns**: Favor immutable updates when manipulating state (e.g., `setCart(prev => prev.map(...))` or `[...prev, newItem]`). Do not mutate arrays or objects in place.

```typescript
// ❌ WRONG: Mutating state directly, using any
const updateItem = (item: any) => {
  item.quantity += 1;
  setCart(cart);
};

// ✅ CORRECT: Pure, strictly-typed immutable state update
const updateItem = (listingId: string, delta: number): void => {
  setCart(prev => prev.map(item => {
    if (item.listingId === listingId) {
      const nextQty = item.quantity + delta;
      return nextQty > 0 ? { ...item, quantity: nextQty } : null;
    }
    return item;
  }).filter(Boolean) as CartItem[]);
};
```

### 1.2 React 19 Standards & Component Patterns
1. **Functional Components**: Use functional components with standard TypeScript typings (`React.FC<Props>` or `function Component(props: Props)`).
2. **Prop Interfaces**: Every component must declare an explicit props interface named `<ComponentName>Props`.
3. **Hooks Rules**: Follow standard React hook constraints. Hooks must be declared at the top level of the component.
4. **Performance & Memoization**: Use `useMemo` and `useCallback` judiciously for expensive calculations (such as multi-factor rank recalculations or large catalog filters).
5. **Clean Rendering**: Avoid inline complex calculations in JSX; extract logic into descriptive helper functions or computed constants above the return block.

### 1.3 Error Handling & Defensive Programming
1. **Graceful Degradation**: Always handle edge cases: empty search queries, empty carts, zero search results, network timeouts, and missing images.
2. **Null Checks**: Perform optional chaining (`listing?.rankFactors?.explanation`) and nullish coalescing (`value ?? defaultValue`) to avoid runtime crashes.
3. **Form Validation**: Validate all inputs (quantities, search terms, address fields, prescription uploads) before triggering state mutations or dispatch actions.

---

## 2. Folder Structure Rules

The codebase must adhere to the following decoupled monorepo directory layout. Do **not** introduce arbitrary top-level directories.

```
genericMed/
├── frontend/                     # React 19 Client SPA
│   ├── src/
│   │   ├── api/client.ts         # Typed REST API Client with fallback resilience
│   │   ├── components/           # Reusable & page-level React components
│   │   ├── data/                 # Client seed/fallback fixtures
│   │   ├── utils/                # i18n & currency formatters
│   │   ├── index.css             # Tailwind CSS v4 styles
│   │   ├── main.tsx              # Vite React entry point
│   │   ├── types.ts              # Authoritative domain contracts
│   │   └── App.tsx               # Root component orchestrating state & tabs
│   ├── public/                   # Static assets & icons
│   ├── index.html                # Vite HTML shell
│   ├── package.json              # Frontend dependencies
│   ├── tsconfig.json             # Frontend TypeScript config
│   ├── vite.config.ts            # Vite proxy to backend API
│   └── .env                      # Frontend environment variables
│
├── backend/                      # Node.js Express REST API
│   ├── src/
│   │   ├── routes/               # Modular Express API routers
│   │   ├── services/store.ts     # In-memory transactional data store
│   │   ├── data/                 # Seed domain datasets
│   │   ├── types.ts              # Backend domain contracts
│   │   └── server.ts             # Express server entry point
│   ├── package.json              # Backend dependencies
│   ├── tsconfig.json             # Backend TypeScript config (NodeNext)
│   └── .env                      # Backend environment variables
│
├── package.json                  # Root monorepo orchestration scripts
├── README.md                     # Comprehensive setup & execution guide
├── .gitignore                    # Root git exclusions
├── decisions.md                  # Architecture & Product Decision Records (ADR)
├── rules.md                      # AI engineering & operating rules (this file)
├── memory.md                     # Long-term project memory, schemas & roadmap
├── changelog.md                  # Chronological project version history
└── phases.md                     # Complete 5-phase lifecycle architecture
```

### Directory Placement Policy
- **Frontend Code**: Place all UI components in `frontend/src/components/`, client utilities in `frontend/src/utils/`, and API methods in `frontend/src/api/`.
- **Backend Code**: Place all API route definitions in `backend/src/routes/` and database/business logic in `backend/src/services/`.
- **Domain Models & Types**: Synchronized across `frontend/src/types.ts` and `backend/src/types.ts`.
- **Domain Models & Types**: Always place in `src/types.ts`.
- **Mock Data & Fixtures**: Place in `src/data/`.
- **Helper Utilities**: Create `src/utils/` for pure computational logic (e.g., unit price calculator, ranking algorithms, currency formatters).

---

## 3. Naming Conventions

Maintain strict naming consistency across all files, functions, and symbols:

| Artifact Type | Convention | Example |
| :--- | :--- | :--- |
| **Component Files** | PascalCase `.tsx` | `CustomerMarketplace.tsx`, `OrdersTracker.tsx` |
| **Component Names** | PascalCase matching filename | `export function CustomerMarketplace() {}` |
| **Props Interfaces** | PascalCase with `Props` suffix | `interface CustomerMarketplaceProps {}` |
| **Type / Model Files** | camelCase `.ts` | `types.ts`, `architectureData.ts` |
| **Type / Interface Names** | PascalCase | `CanonicalProduct`, `ProductListing`, `CartItem` |
| **Type Aliases** | PascalCase | `ActiveTab`, `AppUserRole` |
| **Hook Names** | camelCase with `use` prefix | `useCart`, `useRankingCalculator` |
| **Helper Functions** | camelCase | `calculateNormalizedPrice()`, `filterEligibleSalts()` |
| **Constant Variables** | UPPER_SNAKE_CASE | `CANONICAL_PRODUCTS`, `ARCHITECTURE_LAYERS` |
| **CSS Utility Classes** | Tailwind standard utility classes | `bg-emerald-600`, `text-slate-800`, `flex` |
| **ID Identifiers** | kebab-case with descriptive prefix | `prod-para-500`, `list-para-medplus`, `ORD-2026-8821` |

---

## 4. UI/UX Consistency Rules

genericMed is a mission-critical medical e-commerce application. The interface must communicate **trust, clinical precision, and absolute clarity**.

### 4.1 Design System & Color Palette
- **Primary Brand Color**: Deep Emerald (`emerald-600`, `emerald-700`) representing health, safety, and vitality.
- **Secondary Accent**: Royal Indigo/Blue (`indigo-600`, `blue-600`) for technical, architectural, and partner actions.
- **Surface & Background**: Crisp clean white (`bg-white`) and subtle slate shades (`bg-slate-50`, `bg-slate-100/70`) with high-contrast text (`text-slate-900`, `text-slate-700`).
- **Alert & Severity Colors**:
  - **Success / Savings**: Emerald (`bg-emerald-50 text-emerald-800 border-emerald-200`)
  - **Clinical Warning / Rx Required**: Amber (`bg-amber-50 text-amber-800 border-amber-200`)
  - **Critical Exception / Error**: Rose/Red (`bg-rose-50 text-rose-800 border-rose-200`)
  - **Informational / Neutral**: Slate / Sky (`bg-sky-50 text-sky-800 border-sky-200`)

### 4.2 Typography & Readability
- Modern sans-serif font stack (`system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`).
- Strict typography hierarchy:
  - **Page Titles**: `text-2xl` or `text-3xl font-bold tracking-tight text-slate-900`
  - **Section Headings**: `text-lg font-semibold text-slate-800`
  - **Body Text**: `text-sm text-slate-600 leading-relaxed`
  - **Microcopy / Metadata**: `text-xs font-medium text-slate-500`

### 4.3 Mandatory UI Elements
1. **Normalized Unit Price Pill**: Every product card must display the unit price in bold (e.g., `₹0.70 / tablet`) alongside total pack price.
2. **Savings Badge**: Highlight savings against branded reference price (e.g., `Save 78% vs Crocin`).
3. **Explainable Ranking Pill**: `#1 Ranked` cards must include a tooltip or explanation line detailing factor scores (Price, Trust, Freshness, Feedback).
4. **Prescription Badge**: Items requiring prescription (`prescriptionRequired: true`) must display an amber `Rx Required` badge.
5. **Zero Horizontal Overflow**: All pages and cards must fit within viewports smoothly without horizontal scrolling (except explicitly marked comparison tables).

---

## 5. Git Commit Rules

All commit messages must follow the **Conventional Commits** specification.

### 5.1 Format
```
<type>(<optional scope>): <description in imperative mood>

[optional body explaining rationale and context]

[optional footer(s) referencing issue or PRD section]
```

### 5.2 Allowed Types
- **`feat`**: A new feature or capability (e.g., `feat: add side-by-side comparison matrix`).
- **`fix`**: A bug fix (e.g., `fix: resolve cart revalidation quantity calculation`).
- **`refactor`**: Code change that neither fixes a bug nor adds a feature.
- **`docs`**: Documentation changes only (e.g., `docs: update memory.md with new API endpoints`).
- **`style`**: Changes that do not affect the meaning of the code (formatting, white-space, etc.).
- **`test`**: Adding missing tests or correcting existing tests.
- **`chore`**: Maintenance tasks, dependency updates, build configuration.

### 5.3 Commit Guidelines
- Use the imperative present tense: `feat: add order revalidation` (NOT `added` or `adds`).
- Keep the subject line under 72 characters.
- Reference PRD requirements when applicable (e.g., `feat(checkout): enforce FR-CART-03 live stock revalidation`).
- Keep commits atomic: one conceptual change per commit.

---

## 6. Security and Environment Variable Rules

### 6.1 Secret Management
1. **Never Commit Secrets**: Never commit `.env`, `.env.local`, API keys, private tokens, or database passwords to git.
2. **Template File**: Maintain an up-to-date `.env.example` documenting all necessary environment variables with dummy values.
3. **Client-Side Exposure**: In Vite, only variables prefixed with `VITE_` are exposed to client-side code. Never expose administrative service account keys or private gateway tokens via `VITE_` variables.

### 6.2 Data Security & Privacy (Healthcare Context)
1. **Zero Unencrypted PII/PHI**: Patient names, addresses, prescriptions, and medical histories must be treated as sensitive data. Never log raw patient prescriptions or phone numbers to browser console logs.
2. **Referrer Policy**: External asset hotlinks and images must use `referrerPolicy="no-referrer"` to prevent leaking application URLs.
3. **Input Sanitization**: Sanitize all user-entered search terms and address strings to prevent Cross-Site Scripting (XSS).

---

## 7. Regression Prevention: Never Break Existing Functionality

The AI coding assistant must treat existing code with the utmost respect:

1. **Preserve Component Contracts**: Never remove or alter existing component prop interfaces unless the user specifically asks for a breaking architectural refactor.
2. **Preserve Navigation & Role Flows**: The 4 main tabs (`Live Marketplace App`, `5-Tier Architecture`, `PRD Specification`, `Hotlinks & Assets`) and the 3 user roles (`Customer`, `Pharmacy Partner`, `Admin & Operations`) must remain fully functional.
3. **Preserve Seed Data**: Do not overwrite or delete existing seed records in `CANONICAL_PRODUCTS`, `PRODUCT_LISTINGS`, or `PRD_SECTIONS`. Extend them with additional data if needed.
4. **Validation Check Before Completion**: Always ensure the TypeScript compiler passes without errors:
   ```bash
   npm run lint  # executes: tsc --noEmit
   ```
5. **No Hallucinated Clinical Rules**: Never invent clinical classifications or loosen dosage constraints. When unsure, cross-reference `prdData.ts` and `src/types.ts`.
