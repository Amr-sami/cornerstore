# CornerStore — Full-Stack POS & Inventory Management System
## Complete Agent Implementation Plan

---

## AGENT INSTRUCTIONS — READ FIRST

Before writing any component or page code, you MUST read the following skill file:

```
/mnt/skills/public/frontend-design/SKILL.md
```

This skill defines the design philosophy, aesthetic direction, typography rules, color system, and motion guidelines. All UI work must follow it strictly. Do not skip this step.

---

## Project Overview

| Property | Value |
|---|---|
| **Project Name** | CornerStore |
| **Type** | Point-of-Sale + Inventory Management System |
| **Framework** | Next.js 14 (App Router) |
| **Database** | Firebase Firestore (real-time) |
| **Styling** | Tailwind CSS + CSS Variables |
| **Language** | Arabic ONLY — Full RTL layout |
| **Devices** | Fully responsive: Desktop, Tablet, Mobile |
| **Emoji Policy** | ZERO emojis anywhere in the UI. Use lucide-react SVG icons only |
| **Font Policy** | Arabic font only: `Cairo` from Google Fonts via next/font |

### What This Store Sells
- **Watches** (ساعات) — split by gender (Male / Female), each gender has multiple watch brands
- **Perfumes** (برفانات) — split by gender (Male / Female)
- **Sunglasses** (نظارات) — split by gender (Male / Female)

---

## Firebase Configuration

Project ID: `cornerstore-b5146`

Create `/lib/firebase.ts`:

```typescript
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
```

Create `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAQTU-yFYq7f3TpFCgCjbW8fzZdvx533Ms
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cornerstore-b5146.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cornerstore-b5146
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cornerstore-b5146.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=657964587879
NEXT_PUBLIC_FIREBASE_APP_ID=1:657964587879:web:66d791c499195d9b68adc2
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-HD1D0GD3VP
```

---

## Package Installation

```bash
npx create-next-app@latest cornerstore --typescript --tailwind --app --src-dir=false --import-alias="@/*"
cd cornerstore
npm install firebase lucide-react clsx date-fns
```

---

## TypeScript Types — `/lib/types.ts`

```typescript
export type Category = "watches" | "perfumes" | "sunglasses";
export type Gender = "male" | "female";

export const CATEGORY_LABELS: Record<Category, string> = {
  watches: "ساعات",
  perfumes: "برفانات",
  sunglasses: "نظارات",
};

export const GENDER_LABELS: Record<Gender, string> = {
  male: "رجالي",
  female: "حريمي",
};

export const WATCH_BRANDS = [
  "Casio",
  "G-Shock",
  "Seiko",
  "Citizen",
  "Tissot",
  "Rolex",
  "Omega",
  "Fossil",
  "Michael Kors",
  "Guess",
  "Armani Exchange",
  "Tommy Hilfiger",
  "Hugo Boss",
  "Swatch",
  "Orient",
  "Invicta",
  "Bulova",
  "Longines",
  "Tag Heuer",
  "Other",
];

export interface Product {
  id: string;
  name: string;
  category: Category;
  gender: Gender;
  brand?: string;          // Only for watches
  quantity: number;        // Current stock quantity
  price: number;           // Selling price in EGP
  costPrice?: number;      // Purchase cost (optional)
  lowStockThreshold: number; // Alert when stock falls below this (default: 3)
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  category: Category;
  gender: Gender;
  brand?: string;
  quantitySold: number;
  pricePerUnit: number;
  totalPrice: number;
  saleDate: Date;
  isReturned: boolean;
  returnedAt?: Date;
  returnedQuantity?: number;
  note?: string;
}

export interface Return {
  id: string;
  saleId: string;
  productId: string;
  productName: string;
  returnedQuantity: number;
  returnDate: Date;
  reason: string;
}

// Form state for adding a product
export interface ProductFormData {
  step: 1 | 2 | 3;
  category: Category | null;
  gender: Gender | null;
  brand: string;           // Only if category === "watches"
  customBrand: string;     // If user types a new brand not in the list
  name: string;
  quantity: number;
  price: number;
  costPrice: number;
  lowStockThreshold: number;
}
```

---

## Firestore Data Schema

### Collection: `products`
```
products/{productId}
  name:               string     — Product display name
  category:           string     — "watches" | "perfumes" | "sunglasses"
  gender:             string     — "male" | "female"
  brand:              string?    — Watch brand name (only for watches)
  quantity:           number     — Current stock quantity
  price:              number     — Selling price in EGP
  costPrice:          number?    — Purchase cost in EGP (optional)
  lowStockThreshold:  number     — Default: 3
  createdAt:          Timestamp
  updatedAt:          Timestamp
```

### Collection: `sales`
```
sales/{saleId}
  productId:          string     — Reference to products/{productId}
  productName:        string     — Snapshot of name at time of sale
  category:           string
  gender:             string
  brand:              string?
  quantitySold:       number
  pricePerUnit:       number
  totalPrice:         number     — quantitySold * pricePerUnit
  saleDate:           Timestamp
  isReturned:         boolean    — Default: false
  returnedAt:         Timestamp? — Set when return is processed
  returnedQuantity:   number?    — How many units were returned
  note:               string?    — Optional note from cashier
```

### Collection: `returns`
```
returns/{returnId}
  saleId:             string     — Reference to sales/{saleId}
  productId:          string     — Reference to products/{productId}
  productName:        string     — Snapshot at time of return
  returnedQuantity:   number
  returnDate:         Timestamp
  reason:             string
```

---

## Firestore Service Layer — `/lib/firestore.ts`

Implement all these functions with full error handling:

```typescript
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  runTransaction, onSnapshot, query, orderBy, where,
  serverTimestamp, Timestamp
} from "firebase/firestore";
import { db } from "./firebase";
import type { Product, Sale, Return, Category, Gender } from "./types";

// ─── PRODUCTS ────────────────────────────────────────────────

// Add a new product to inventory
export async function addProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<string>

// Update an existing product's details
export async function updateProduct(productId: string, data: Partial<Omit<Product, "id" | "createdAt">>): Promise<void>

// Delete a product (only if quantity is 0, otherwise throw)
export async function deleteProduct(productId: string): Promise<void>

// Real-time listener for all products — returns unsubscribe function
export function subscribeToProducts(callback: (products: Product[]) => void): () => void

// ─── SALES ───────────────────────────────────────────────────

// Record a sale using Firestore Transaction to atomically:
//   1. Check product quantity is sufficient
//   2. Deduct quantity from products/{productId}
//   3. Create a new sale document in sales collection
export async function recordSale(
  productId: string,
  quantitySold: number,
  pricePerUnit: number,
  note?: string
): Promise<string>

// Real-time listener for all sales ordered by saleDate desc
export function subscribeToSales(callback: (sales: Sale[]) => void): () => void

// ─── RETURNS ─────────────────────────────────────────────────

// Record a return using Firestore Transaction to atomically:
//   1. Add returnedQuantity back to products/{productId} stock
//   2. Update sales/{saleId}: isReturned=true, returnedAt, returnedQuantity
//   3. Create a new return document in returns collection
export async function recordReturn(
  saleId: string,
  productId: string,
  returnedQuantity: number,
  reason: string
): Promise<void>

// Real-time listener for all returns
export function subscribeToReturns(callback: (returns: Return[]) => void): () => void
```

**CRITICAL implementation note for transactions:**
```typescript
export async function recordSale(productId, quantitySold, pricePerUnit, note) {
  const productRef = doc(db, "products", productId);
  const saleRef = doc(collection(db, "sales"));

  return await runTransaction(db, async (transaction) => {
    const productSnap = await transaction.get(productRef);
    if (!productSnap.exists()) throw new Error("المنتج غير موجود");

    const currentQty = productSnap.data().quantity;
    if (currentQty < quantitySold) throw new Error("الكمية المطلوبة غير متوفرة في المخزن");

    const productData = productSnap.data();

    transaction.update(productRef, {
      quantity: currentQty - quantitySold,
      updatedAt: serverTimestamp(),
    });

    transaction.set(saleRef, {
      productId,
      productName: productData.name,
      category: productData.category,
      gender: productData.gender,
      brand: productData.brand || null,
      quantitySold,
      pricePerUnit,
      totalPrice: quantitySold * pricePerUnit,
      saleDate: serverTimestamp(),
      isReturned: false,
      returnedAt: null,
      returnedQuantity: null,
      note: note || null,
    });

    return saleRef.id;
  });
}
```

---

## Custom Hooks

### `/hooks/useProducts.ts`
```typescript
// Subscribes to Firestore products collection in real-time
// Returns: { products, loading, error }
// Uses onSnapshot from subscribeToProducts()
```

### `/hooks/useSales.ts`
```typescript
// Subscribes to Firestore sales collection in real-time
// Returns: { sales, loading, error }
```

### `/hooks/useReturns.ts`
```typescript
// Subscribes to Firestore returns collection in real-time
// Returns: { returns, loading, error }
```

### `/hooks/useSearch.ts`
```typescript
// Generic client-side real-time search hook
// Takes: items array + array of keys to search within
// Returns: { query, setQuery, filtered }
// Uses useMemo for performance — filters as user types

export function useSearch<T>(items: T[], keys: (keyof T)[]) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((item) =>
      keys.some((key) => String(item[key] ?? "").toLowerCase().includes(q))
    );
  }, [query, items, keys]);

  return { query, setQuery, filtered };
}
```

---

## Project File Structure

```
cornerstore/
├── app/
│   ├── layout.tsx                     # Root RTL layout with Cairo font
│   ├── page.tsx                       # Dashboard (/)
│   ├── globals.css                    # Tailwind directives + CSS variables
│   ├── inventory/
│   │   └── page.tsx                   # Inventory management (/inventory)
│   ├── sales/
│   │   └── page.tsx                   # Sales recording (/sales)
│   ├── add-product/
│   │   └── page.tsx                   # Add/Edit product (/add-product)
│   └── returns/
│       └── page.tsx                   # Returns management (/returns)
│
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx               # Wraps sidebar + main content
│   │   ├── Sidebar.tsx                # Desktop navigation sidebar
│   │   ├── Header.tsx                 # Top header bar with page title
│   │   └── MobileBottomNav.tsx        # Bottom navigation bar for mobile
│   │
│   ├── ui/
│   │   ├── Button.tsx                 # Reusable button component (variants: primary, secondary, danger, ghost)
│   │   ├── Input.tsx                  # Reusable Arabic RTL input field
│   │   ├── Select.tsx                 # Reusable Arabic select dropdown
│   │   ├── Badge.tsx                  # Category/gender/status badge
│   │   ├── Modal.tsx                  # Reusable modal dialog
│   │   ├── LoadingSpinner.tsx         # Loading indicator
│   │   ├── EmptyState.tsx             # No results / empty state display
│   │   ├── ConfirmDialog.tsx          # Confirmation dialog for delete/return actions
│   │   └── Toast.tsx                  # Success/error notification
│   │
│   ├── dashboard/
│   │   ├── StatsGrid.tsx              # Grid of 4 stat cards
│   │   ├── StatCard.tsx               # Individual stat card (total sales, stock count, etc.)
│   │   ├── LowStockAlert.tsx          # Warning list of products below threshold
│   │   └── RecentSalesList.tsx        # Last 10 sales table
│   │
│   ├── inventory/
│   │   ├── InventorySearchBar.tsx     # Real-time search input
│   │   ├── InventoryFilters.tsx       # Category + Gender + Brand filter buttons
│   │   ├── ProductTable.tsx           # Main products data table (desktop)
│   │   ├── ProductCard.tsx            # Product card for mobile view
│   │   ├── ProductTableRow.tsx        # Single row in ProductTable
│   │   └── EditProductModal.tsx       # Modal to edit existing product quantity/price
│   │
│   ├── sales/
│   │   ├── SaleForm.tsx               # Form to record a new sale
│   │   ├── ProductSearchSelect.tsx    # Searchable dropdown to select product for sale
│   │   ├── SalesSearchBar.tsx         # Real-time search in sales history
│   │   ├── SalesFilters.tsx           # Date range + category filter
│   │   ├── SalesTable.tsx             # Sales history table
│   │   ├── SalesTableRow.tsx          # Single sale row with Return button
│   │   └── SaleSummaryCard.tsx        # Today's total revenue card
│   │
│   ├── add-product/
│   │   ├── StepIndicator.tsx          # Shows Step 1/2/3 progress
│   │   ├── Step1Category.tsx          # Step 1: Choose category (watches/perfumes/sunglasses)
│   │   ├── Step2Gender.tsx            # Step 2: Choose gender (male/female)
│   │   └── Step3Details.tsx           # Step 3: Name, brand (watches), qty, price
│   │
│   └── returns/
│       ├── ReturnModal.tsx            # Modal triggered from sales table row
│       ├── ReturnsTable.tsx           # Table of all return records
│       └── ReturnsTableRow.tsx        # Single return record row
│
├── hooks/
│   ├── useProducts.ts
│   ├── useSales.ts
│   ├── useReturns.ts
│   └── useSearch.ts
│
├── lib/
│   ├── firebase.ts
│   ├── firestore.ts
│   └── types.ts
│
├── .env.local
├── tailwind.config.ts
└── next.config.ts
```

---

## Design System

### READ THE SKILL FILE FIRST
Before writing any UI code, read `/mnt/skills/public/frontend-design/SKILL.md` and commit to the aesthetic direction described below.

### Aesthetic Direction: "Refined Arabic Luxury Utility"

This is a professional POS system for a store selling watches, perfumes, and sunglasses — premium retail products. The UI should feel like it belongs in a high-end boutique, not a generic SaaS dashboard. Think refined, precise, and calm — with enough warmth for an Arabic-speaking user in a fast-paced retail environment.

**Color Palette (CSS Variables in globals.css):**
```css
:root {
  --bg-main: #F5F3EF;          /* Warm off-white — main page background */
  --bg-card: #FFFFFF;           /* Pure white — cards and panels */
  --bg-sidebar: #1C1C1E;        /* Near-black — sidebar background */
  --text-primary: #1A1A1A;      /* Almost black — main text */
  --text-secondary: #6B6B6B;    /* Medium gray — secondary text */
  --text-sidebar: #E8E8E8;      /* Light — sidebar text */
  --accent: #C9A84C;            /* Warm gold — primary accent */
  --accent-hover: #B8962E;      /* Darker gold — hover state */
  --accent-light: #F5EDD6;      /* Light gold tint — accent backgrounds */
  --danger: #C0392B;            /* Red — delete, danger actions */
  --danger-light: #FDEAEA;      /* Light red — danger backgrounds */
  --success: #27AE60;           /* Green — success states */
  --success-light: #EAFAF1;     /* Light green — success backgrounds */
  --border: #E8E4DC;            /* Warm light gray — borders */
  --shadow: 0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04);
}
```

**Typography:**
```typescript
// app/layout.tsx
import { Cairo } from "next/font/google";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
});
```

```css
/* globals.css */
body {
  font-family: var(--font-cairo), sans-serif;
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-primary);
  background: var(--bg-main);
  direction: rtl;
}

h1 { font-size: 1.75rem; font-weight: 700; }
h2 { font-size: 1.375rem; font-weight: 600; }
h3 { font-size: 1.125rem; font-weight: 600; }
```

**Tailwind Config:**
```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        arabic: ["var(--font-cairo)", "sans-serif"],
      },
      colors: {
        accent: {
          DEFAULT: "#C9A84C",
          hover: "#B8962E",
          light: "#F5EDD6",
        },
        surface: "#1C1C1E",
      },
    },
  },
  plugins: [],
};
export default config;
```

### RTL Rules (CRITICAL — Apply Everywhere)
- All pages: `<html lang="ar" dir="rtl">`
- Flex rows naturally reverse in RTL — use `flex-row` and let RTL handle direction
- Padding/margin: use `ps-` (padding-start) and `pe-` (padding-end) instead of `pl`/`pr`
- Text alignment: `text-start` defaults to right in RTL — use it instead of `text-right`
- Icons in text: icons go on the LEFT side visually, which is `ms-2` (margin-start) in RTL
- Sidebar: fixed to the RIGHT side on desktop (not left)
- Chevron/arrow icons: flip horizontally with `rotate-180` when needed for RTL context
- Tables: first column is on the right
- No emojis anywhere — use `lucide-react` icons throughout

---

## Pages — Detailed Specification

---

### Page 1: Dashboard — `app/page.tsx`

**Purpose:** Quick overview of store health at a glance.

**Layout:**
```
[Header: "لوحة التحكم"]
[Stats Grid — 4 cards across]
[Two columns: Left=LowStockAlerts, Right=RecentSales]
```

**StatsGrid — 4 StatCards:**
1. **إجمالي مبيعات اليوم** — Sum of `totalPrice` from sales where `saleDate >= today 00:00`
2. **عدد الأصناف** — Total count of documents in `products` collection
3. **مبيعات هذا الشهر** — Sum of `totalPrice` for current month
4. **مرتجعات هذا الشهر** — Count of returns documents for current month

**LowStockAlert Component:**
- Query products where `quantity <= lowStockThreshold`
- Show as a list with product name, category badge, gender, current quantity
- If quantity is 0: show red "نفذ" badge
- If quantity <= threshold: show orange "كمية منخفضة" badge
- If list is empty: show green "المخزن بخير" message

**RecentSalesList:**
- Last 10 sales ordered by saleDate descending
- Columns: المنتج / الكمية / الإجمالي / التاريخ / الحالة
- Date formatted in Arabic (e.g., "15 أبريل 2026")
- Status badge: "مباع" (success) or "مرتجع" (danger)

---

### Page 2: Inventory — `app/inventory/page.tsx`

**Purpose:** Browse, search, and manage all products in stock.

**Layout:**
```
[Header: "المخزن"]
[SearchBar — full width]
[FilterBar — category pills + gender pills + brand dropdown (if watches selected)]
[ProductTable (desktop) / ProductCard grid (mobile)]
```

**InventorySearchBar:**
- `<input type="text" placeholder="ابحث عن منتج، براند، أو صنف...">` 
- `onChange` fires `setQuery` immediately — NO search button
- Search is performed client-side using `useSearch` hook over: `name`, `brand`, `category`
- Clear button (X icon) appears when query is not empty

**InventoryFilters:**
```
Category Pills: [الكل] [ساعات] [برفانات] [نظارات]
Gender Pills:   [الكل] [رجالي] [حريمي]
Brand Dropdown: (only visible when category="watches") — lists all unique brands from products
Sort By:        [الاسم] [الكمية] [السعر] [الأحدث]
```
- Active pill has accent gold background
- All filters work simultaneously with the search — they all reduce the displayed list

**ProductTable (Desktop — md and above):**

Columns (RTL order — rightmost = first):
| # | اسم المنتج | الصنف | الجنس | البراند | الكمية | السعر | الإجراءات |
|---|---|---|---|---|---|---|---|

- If quantity is 0: row has a subtle red left border (right border in RTL)
- If quantity <= threshold: row has a subtle orange left border
- **إجراءات column buttons:**
  - "بيع" — opens SaleForm modal pre-filled with this product
  - "تعديل" — opens EditProductModal
  - "حذف" — opens ConfirmDialog (only if quantity = 0, else show tooltip "لا يمكن حذف منتج له مخزون")

**ProductCard (Mobile — below md):**
- Card per product showing: name, category badge, gender, brand (if any), quantity with color indicator, price
- Tap to expand actions: بيع / تعديل

**EditProductModal:**
- Edit fields: الاسم / الكمية / السعر / سعر التكلفة / حد التنبيه
- Saves via `updateProduct()` with updatedAt = serverTimestamp

---

### Page 3: Sales — `app/sales/page.tsx`

**Purpose:** Record new sales and view sales history with real-time search.

**Layout:**
```
[Header: "المبيعات"]
[SaleSummaryCard — today's revenue]
[Two sections: Top=SaleForm, Bottom=SalesHistory]
```

**SaleForm — Record a New Sale:**

Fields:
1. **اختيار المنتج** — Searchable select (`ProductSearchSelect` component):
   - Input field that filters products by name/brand as user types
   - Dropdown shows filtered products with: name + category badge + available quantity
   - When product selected: auto-fill price field, show available quantity as hint
   
2. **الكمية** — Number input (min: 1, max: product.quantity)
   - Show error if user tries to enter more than available quantity

3. **السعر للوحدة** — Number input (pre-filled from product.price, editable)

4. **الإجمالي** — Read-only display: `quantity × pricePerUnit` — updates live as user types

5. **ملاحظة** — Optional textarea (اختياري)

6. **زر "تسجيل البيع"** — Calls `recordSale()` transaction, shows loading state, then success toast

**On successful sale:**
- Show toast: "تم تسجيل البيع بنجاح"
- Reset form
- ProductTable updates automatically via onSnapshot

**SalesHistory Section:**

- `SalesSearchBar` — real-time search over: productName, brand, category
- `SalesFilters`:
  ```
  Date: [اليوم] [هذا الأسبوع] [هذا الشهر] [الكل]
  Category: [الكل] [ساعات] [برفانات] [نظارات]
  Status: [الكل] [مباع] [مرتجع]
  ```

**SalesTable Columns (RTL):**
| التاريخ | المنتج | الصنف | الجنس | البراند | الكمية | السعر | الإجمالي | الحالة | إجراء |
|---|---|---|---|---|---|---|---|---|---|

- Status badge: "مباع" green / "مرتجع" red
- "إجراء" column: "مرتجع" button — disabled + strikethrough if `isReturned === true`
- Clicking "مرتجع" opens `ReturnModal`

---

### Page 4: Add Product — `app/add-product/page.tsx`

**Purpose:** Add new products to inventory using a clear, guided multi-step form.

**Layout:**
```
[Header: "إضافة صنف جديد"]
[StepIndicator: Step 1 → Step 2 → Step 3]
[Current Step Form]
[Navigation: Back / Next / Save]
```

**StepIndicator Component:**
```
[1 — الصنف] ——— [2 — الجنس] ——— [3 — التفاصيل]
```
- Completed steps: filled gold circle with checkmark icon
- Active step: filled gold circle with step number
- Upcoming steps: empty circle with step number, grayed out

**Step 1 — اختيار الصنف:**

Three large selection cards arranged in a row (or column on mobile):

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│                 │  │                 │  │                 │
│  [Watch Icon]   │  │ [Perfume Icon]  │  │ [Glasses Icon]  │
│                 │  │                 │  │                 │
│    ساعات        │  │    برفانات      │  │    نظارات       │
│                 │  │                 │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

- Cards are large, clickable, visually prominent
- Selected card: gold border + gold background tint + gold text
- Unselected: border-gray, white background
- "التالي" button is disabled until a category is selected

**Step 2 — اختيار الجنس:**

Two large selection cards:
```
┌───────────────────────┐    ┌───────────────────────┐
│                       │    │                       │
│    [Male Icon]        │    │   [Female Icon]       │
│                       │    │                       │
│       رجالي           │    │       حريمي           │
│                       │    │                       │
└───────────────────────┘    └───────────────────────┘
```

- Same selection card behavior
- "التالي" disabled until gender selected
- "السابق" button returns to Step 1

**Step 3 — تفاصيل المنتج:**

This step adapts based on the category selected in Step 1.

**If category = "watches":**
```
البراند *
[Dropdown — list of WATCH_BRANDS]
  └── If "Other" selected: show text input "أدخل اسم البراند"

اسم الموديل *
[Text input — e.g., "كاسيو كلاسيك فضي"]

الكمية *
[Number input — min: 1]

سعر البيع (جنيه) *
[Number input]

سعر الشراء (جنيه)
[Number input — optional]

حد التنبيه عند انخفاض الكمية
[Number input — default: 3]
```

**If category = "perfumes" or "sunglasses":**
```
اسم المنتج *
[Text input]

الكمية *
[Number input — min: 1]

سعر البيع (جنيه) *
[Number input]

سعر الشراء (جنيه)
[Number input — optional]

حد التنبيه عند انخفاض الكمية
[Number input — default: 3]
```

- All required fields marked with *
- "حفظ المنتج" button: calls `addProduct()`, shows loading state
- On success: show toast "تم إضافة المنتج بنجاح" + reset form to Step 1
- "السابق" button returns to Step 2

**Validation Rules:**
- Name: required, min 2 characters
- Category: required (from Step 1)
- Gender: required (from Step 2)
- Brand: required if category = watches
- Quantity: required, must be >= 1
- Price: required, must be > 0
- costPrice: optional
- lowStockThreshold: optional, default 3

---

### Page 5: Returns — `app/returns/page.tsx`

**Purpose:** View all return records. Returns are initiated from the Sales page.

**Layout:**
```
[Header: "المرتجعات"]
[Summary card: Total returns this month]
[ReturnsTable]
```

**ReturnsTable Columns (RTL):**
| التاريخ | المنتج | الكمية المرتجعة | سبب الإرجاع | رقم البيع |
|---|---|---|---|---|

- Table sorted by returnDate descending
- No actions in this table — it's read-only history

**ReturnModal (triggered from Sales page "مرتجع" button):**

```
[Modal Title: "تسجيل مرتجع"]

المنتج: [Product Name — read only]
الكمية المباعة: [quantitySold — read only]

الكمية المرتجعة *
[Number input — min: 1, max: quantitySold]

سبب الإرجاع *
[Select dropdown]:
  - عيب في المنتج
  - المنتج لم يعجب العميل
  - حجم غير مناسب
  - أخرى

[لو اختار "أخرى": text input "اكتب السبب"]

[زر "تأكيد الإرجاع"] [زر "إلغاء"]
```

- On confirm: calls `recordReturn()` transaction
- Transaction atomically: adds quantity back to stock + marks sale as returned + creates return record
- On success: toast "تم تسجيل المرتجع وتحديث المخزن"
- Modal closes, sales table updates (isReturned = true, button disabled)

---

## Layout Components — Detailed Spec

### `AppShell.tsx`
- Desktop (lg+): fixed sidebar on RIGHT, main content has `margin-right: sidebar-width`
- Tablet (md): collapsible sidebar with overlay
- Mobile (below md): NO sidebar — use `MobileBottomNav` fixed at the bottom

### `Sidebar.tsx` (Desktop)
```
[Store Logo / Name: "Corner Store"]
[Navigation Links:]
  - لوحة التحكم    (LayoutDashboard icon)
  - المخزن          (Package icon)
  - المبيعات        (ShoppingCart icon)
  - إضافة صنف       (PlusSquare icon)
  - المرتجعات       (RotateCcw icon)
```
- Active link: gold accent background + gold text
- Sidebar width: 240px
- Background: `var(--bg-sidebar)` — near black
- Text: `var(--text-sidebar)` — light gray
- Active link icon and text: `var(--accent)` — gold

### `MobileBottomNav.tsx` (Mobile)
Fixed bottom bar with 5 icon-only buttons:
- لوحة التحكم / المخزن / المبيعات / إضافة / المرتجعات
- Active: gold icon
- Inactive: gray icon
- No labels (icons only to save space) OR short Arabic labels

### `Header.tsx`
- Shows current page title in Arabic
- On mobile: shows hamburger menu button (triggers sidebar drawer)
- Optionally: show current date in Arabic on the right side

---

## Shared UI Components Spec

### `Button.tsx`
```typescript
type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

// primary: gold background, white text
// secondary: white background, gold border, gold text  
// danger: red background, white text
// ghost: transparent, gray text, hover shows background
```

### `Input.tsx`
```typescript
// RTL-aware input
// dir="rtl", text-align: right
// Focus: gold ring (ring-accent)
// Error state: red ring + error message below
// Label above the input
```

### `Badge.tsx`
```typescript
type BadgeVariant = "watches" | "perfumes" | "sunglasses" | "male" | "female" | "sold" | "returned" | "lowstock" | "outofstock";

// watches: blue tint
// perfumes: purple tint  
// sunglasses: teal tint
// male: blue tint
// female: pink tint
// sold: green
// returned: red
// lowstock: orange
// outofstock: dark red
```

### `Modal.tsx`
- Fixed overlay with backdrop blur
- Centered card with shadow
- Header: title + close button (X icon)
- Body: children
- Footer: action buttons
- Click outside to close
- ESC key to close
- Traps focus inside modal

### `Toast.tsx`
- Fixed bottom-right (bottom-left in RTL = bottom-right visually)
- Auto-dismiss after 3 seconds
- Types: success (green) / error (red) / warning (orange)
- Slide-in animation

---

## Responsive Breakpoints

| Breakpoint | Width | Layout |
|---|---|---|
| Mobile | < 768px | Bottom nav, stacked cards, no sidebar |
| Tablet | 768px–1024px | Collapsible sidebar, responsive tables |
| Desktop | > 1024px | Fixed sidebar, full table view |

**Tables on Mobile:**
- ProductTable → switches to ProductCard grid (2 columns)
- SalesTable → horizontal scroll with sticky first column
- ReturnsTable → horizontal scroll

---

## Loading & Error States

**Every data-fetching component must handle:**
1. **Loading state:** Show `LoadingSpinner` centered in the section
2. **Error state:** Show error message in Arabic with retry button
3. **Empty state:** Show `EmptyState` component with relevant Arabic message

**Arabic empty state messages:**
- Products (no products yet): "لم تتم إضافة أي أصناف بعد. ابدأ بإضافة صنف جديد."
- Products (no search results): "لا توجد نتائج للبحث عن «{query}»"
- Sales (no sales): "لم يتم تسجيل أي مبيعات بعد."
- Returns (no returns): "لم تتم أي مرتجعات بعد."

---

## Number & Date Formatting

```typescript
// lib/utils.ts

// Format price in Egyptian Pounds
export function formatPrice(amount: number): string {
  return `${amount.toLocaleString("ar-EG")} ج.م`;
}

// Format date in Arabic
export function formatDate(date: Date): string {
  return date.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Format date with time
export function formatDateTime(date: Date): string {
  return date.toLocaleString("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
```

---

## Implementation Order (Step by Step for Agent)

### Phase 1 — Project Foundation
1. Run `create-next-app` with TypeScript, Tailwind, App Router
2. Install packages: `firebase`, `lucide-react`, `clsx`, `date-fns`
3. Create `.env.local` with Firebase config values
4. Create `lib/firebase.ts`
5. Configure `tailwind.config.ts` with colors and Cairo font variable
6. Set up `app/globals.css` with CSS variables + base RTL styles
7. Set up `app/layout.tsx` with Cairo font + `lang="ar"` + `dir="rtl"`
8. Create `lib/types.ts` with all interfaces
9. Create `lib/utils.ts` with formatting functions

### Phase 2 — Data Layer
10. Create `lib/firestore.ts` with all CRUD functions and Firestore transactions
11. Create `hooks/useProducts.ts`
12. Create `hooks/useSales.ts`
13. Create `hooks/useReturns.ts`
14. Create `hooks/useSearch.ts`

### Phase 3 — UI Components
15. Create all shared UI components (`Button`, `Input`, `Select`, `Badge`, `Modal`, `Toast`, `LoadingSpinner`, `EmptyState`, `ConfirmDialog`)
16. Create layout components (`AppShell`, `Sidebar`, `Header`, `MobileBottomNav`)

### Phase 4 — Dashboard Page
17. `components/dashboard/StatCard.tsx`
18. `components/dashboard/StatsGrid.tsx`
19. `components/dashboard/LowStockAlert.tsx`
20. `components/dashboard/RecentSalesList.tsx`
21. `app/page.tsx` — assemble dashboard

### Phase 5 — Inventory Page
22. `components/inventory/InventorySearchBar.tsx`
23. `components/inventory/InventoryFilters.tsx`
24. `components/inventory/ProductTableRow.tsx`
25. `components/inventory/ProductTable.tsx`
26. `components/inventory/ProductCard.tsx`
27. `components/inventory/EditProductModal.tsx`
28. `app/inventory/page.tsx` — assemble inventory page

### Phase 6 — Sales Page
29. `components/sales/ProductSearchSelect.tsx`
30. `components/sales/SaleForm.tsx`
31. `components/sales/SaleSummaryCard.tsx`
32. `components/sales/SalesSearchBar.tsx`
33. `components/sales/SalesFilters.tsx`
34. `components/sales/SalesTableRow.tsx`
35. `components/sales/SalesTable.tsx`
36. `app/sales/page.tsx` — assemble sales page

### Phase 7 — Add Product Page
37. `components/add-product/StepIndicator.tsx`
38. `components/add-product/Step1Category.tsx`
39. `components/add-product/Step2Gender.tsx`
40. `components/add-product/Step3Details.tsx`
41. `app/add-product/page.tsx` — assemble multi-step form

### Phase 8 — Returns Page
42. `components/returns/ReturnModal.tsx`
43. `components/returns/ReturnsTableRow.tsx`
44. `components/returns/ReturnsTable.tsx`
45. `app/returns/page.tsx` — assemble returns page

### Phase 9 — Polish & QA
46. Test all Firestore transactions (sale → stock deducted, return → stock restored)
47. Test real-time search on all pages
48. Test all filter combinations
49. Test on mobile: bottom nav, card layout, horizontal scroll on tables
50. Verify zero emojis exist anywhere in the codebase
51. Verify RTL layout is correct on all components (sidebar on right, text right-aligned, etc.)
52. Add error boundaries and loading states to all pages
53. Verify Arabic number/date formatting is consistent

---

## Critical Rules Summary for Agent

| Rule | Detail |
|---|---|
| **NO EMOJIS** | Absolutely zero emojis anywhere. Use lucide-react icons only |
| **Full RTL** | `dir="rtl"` on `<html>`. All layouts must be RTL-native |
| **Arabic only** | Every UI string must be in Arabic. No English labels in UI |
| **Cairo font** | Only font allowed. Import via next/font/google |
| **Real-time search** | `onChange` on input, no submit button, client-side filter via useSearch hook |
| **Firestore transactions** | Every sale and every return MUST use `runTransaction` — no separate reads and writes |
| **onSnapshot** | Products and sales must use real-time listeners, not one-time `getDocs` |
| **Sidebar position** | On the RIGHT side (RTL — this is the natural "start" side in RTL) |
| **Read the skill** | Before writing any UI code, read `/mnt/skills/public/frontend-design/SKILL.md` |
| **Mobile first** | Design and test for mobile. Sidebar becomes bottom nav on mobile |
| **Gold accent** | `#C9A84C` is the primary accent. Use it for active states, CTAs, step indicators |
| **Warm palette** | Background is warm off-white `#F5F3EF`, not pure white or gray |