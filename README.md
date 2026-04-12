# HammerFlow - Roofing Business Management App

A comprehensive roofing business management application built by Jax (self-improving AI).

## Features

### Core Modules (All 8 Pages Built)
- **Dashboard** - Stats, quick actions, recent activity
- **Lead Management** - Track leads, follow-ups, source tracking, status
- **Customer Database** - Full customer history, jobs, total spent
- **Job Management** - Track jobs from start to finish
- **Estimating** - Create estimates with materials, labor, overhead, profit
- **Invoicing** - Generate invoices, track payments, due dates
- **Inventory** - Material tracking with low-stock alerts
- **Reports** - Revenue charts, job profitability

### Key Features
- ✅ Roof square footage calculator with pitch factors
- ✅ Job costing (estimate vs actual)
- ✅ Lead source tracking
- ✅ Payment tracking (Paid, Pending, Overdue)
- ✅ Low stock inventory alerts
- ✅ Revenue by month charts
- ✅ Job profitability reports
- ✅ Export to CSV
- ✅ Local storage (works offline)

### Calculator Features
- Roof area with pitch factor
- Estimate calculator with overhead, profit, tax
- Auto-generate IDs (LEAD-XXX, JOB-XXX, INV-XXX)

## Files

```
jax-roofing-app/
├── SPEC.md      # Full specification (10 modules)
├── index.html   # Complete UI (8 pages, 6 modals)
├── app.js       # Advanced logic + calculators
└── README.md    # This file
```

## Usage

Open `index.html` in any web browser to use the app.

## Key Differences from Original Yellow Hammer App

| Feature | Original | HammerFlow |
|---------|----------|------------|
| Pages | 2-3 | 8 |
| Job Costing | Basic | Full tracking |
| Inventory | No | Yes with alerts |
| Reports | None | Charts + metrics |
| Calculations | Manual | Auto-calculators |
| Offline | No | Yes |

## Technology Stack
- Pure HTML/CSS/JS (no frameworks)
- LocalStorage for data persistence
- Works completely offline

## To Deploy
1. Host on any static hosting (GitHub Pages, Netlify, Vercel)
2. Or run locally: open `index.html` in browser

---

## Version 1.2 Updates

### New Features Added:
- ✅ **Job Costing** - Track actual costs vs estimate
- ✅ **Profit Margins** - Per-job profitability tracking
- ✅ **Photo Storage UI** - Before/during/after photos
- ✅ **Payment Recording** - Track payment methods
- ✅ **Low Stock Alerts** - Visual alerts in inventory
- ✅ **Revenue Charts** - Monthly revenue visualization
- ✅ **Invoice Tax** - Auto-calculate tax
- ✅ **Google Sheets Placeholder** - Ready for integration

### File Structure
```
jax-roofing-app/
├── SPEC.md           # Full specification
├── index.html        # Complete UI
├── app.js           # Core logic + calculators
├── ui-functions.js  # UI interactions
└── README.md        # Documentation
```

## To Add Google Sheets Later:
1. Get Google Cloud credentials
2. Enable Sheets API
3. Add credentials to app.js

---

*Built by Jax (Self-Improving AI)*
*Version 1.2 - April 2026*
*HammerFlow - Build Your Business*