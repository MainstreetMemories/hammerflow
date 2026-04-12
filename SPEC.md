# HammerFlow - Complete Specification

## App Overview
**Name:** HammerFlow
**Tagline:** "Build Your Business"
**Type:** Roofing Business Management Web Application
**Version:** 1.3
**Built By:** Jax (Self-Improving AI)

---

## 1. CORE MODULES

### 1.1 Dashboard
- Today's schedule overview
- Quick stats (Revenue, Active Jobs, Pending Leads, Outstanding)
- Revenue chart (monthly bar chart)
- Recent activity feed
- Quick action buttons (New Lead, Customer, Job, Estimate, Invoice)
- Alerts for overdue invoices, low stock items

### 1.2 Lead Management
- Lead entry form
- Fields: Name, Phone, Email, Address, Source, Status, Follow-up Date, Notes
- Status options: New, Contacted, Scheduled, Estimate Sent, Converted, Lost
- Source tracking: Google, Referral, Door Knock, Facebook, Other
- Edit/Delete functionality
- Search and filter
- Convert lead to customer

### 1.3 Customer Management
- Full customer database
- Fields: Name, Phone, Email, Property Address, Mailing Address
- History of jobs
- Total spent tracking
- Notes

### 1.4 Job Management
- Job creation from customer or lead
- Fields: Customer, Address, Type, Status, Start Date, End Date, Crew, Value, Notes
- Job types: Replace, Repair, New Build
- Status options: New, Scheduled, In Progress, Completed, Paid
- Crew assignment
- Job costing (track actual expenses vs estimate)

### 1.5 Estimating
- Create estimates with line items
- Roof type selection (Shingle, Metal, Flat, Tile, Slate, Wood)
- Square footage calculator with pitch factors
- Line items:
  - Materials (quantity, unit cost)
  - Labor (hours, rate)
- Automatic calculations:
  - Overhead markup (default 15%)
  - Profit margin (default 20%)
  - Tax (default 8%)
- Export to PDF (future)
- Convert estimate to job or invoice

### 1.6 Invoicing
- Create from estimate or custom
- Invoice number auto-generated (INV-XXX)
- Fields: Customer, Job, Amount, Tax, Total, Due Date, Status
- Status: Pending, Partial, Paid, Overdue
- Payment recording: Date, Method (Cash, Check, Card, ACH)
- Email invoice option

### 1.7 Job Costing
- Track actual costs per job
- Categories: Materials, Labor, Equipment, Disposal, Permit, Other
- Compare estimate vs actual
- Calculate profit and margin per job
- Visual profit indicators (green/yellow/red)

### 1.8 Inventory/Materials
- Material database
- Fields: Name, Unit, Cost/Unit, Current Stock, Min Stock
- Auto low-stock alerts
- Update quantity
- Track usage per job

### 1.9 Reports
- Dashboard stats
- Revenue by month (bar chart)
- Job profitability table
- Conversion rate
- Average job value
- Low stock alerts

---

## 2. EXTENDED FEATURES (v1.3)

### 2.1 Crew Management
- Crew list with members, leader, hourly rate
- Assign crews to jobs

### 2.2 Material Pricing
- Standard material pricing matrix
- Cost vs Price tracking
- Auto-calculate from sqft

### 2.3 Email Templates
- Lead follow-up
- Estimate sent
- Invoice sent
- Job completion
- Placeholder replacement

### 2.4 Text Templates
- Appointment confirmation
- Crew arrival notice
- Payment reminder
- Thank you / review request

### 2.5 Contract Clauses
- Payment terms
- Timeline
- Warranty
- Cleanup
- Permit

### 2.6 Inspection Checklist
- Before, During, After checklists
- For quality control

### 2.7 Certificate of Completion
- Auto-generate completion certificate
- Certificate number
- Warranty info

### 2.8 Vehicle Tracking
- Vehicle list
- Service tracking
- Plate numbers

### 2.9 Reminders
- Follow-up reminders
- Payment reminders
- Service reminders

### 2.10 Document Storage
- Attach contracts, permits, insurance to jobs
- File type tracking

---

## 3. ROOFING CALCULATIONS

### 3.1 Roof Area Formula
```
Roof Area = Length × Width × Pitch Factor
```

### 3.2 Pitch Factors
| Pitch | Factor |
|-------|--------|
| Flat | 1.000 |
| 3/12 | 1.031 |
| 4/12 | 1.054 |
| 5/12 | 1.083 |
| 6/12 | 1.118 |
| 8/12 | 1.202 |
| 10/12 | 1.302 |
| 12/12 | 1.414 |

### 3.3 Shingle Calculator
- 1 square = 100 sq ft
- 3 bundles per square (architectural)
- Auto-calculate bundles needed

---

## 4. DATA STORAGE

### 4.1 LocalStorage
- All data stored in browser localStorage
- Works offline
- Data persists between sessions

### 4.2 Google Sheets (Future)
- Placeholder for API integration
- Need credentials to enable

---

## 5. ROOF TYPES SUPPORTED
- Asphalt Shingle
- Metal (Standing Seam, Corrugated)
- Flat (TPO, EPDM)
- Tile (Clay, Concrete)
- Slate
- Wood Shake

---

## 6. COMMON LINE ITEMS
- Tear-off
- Underlayment
- Drip edge
- Valley flashing
- Ridge venting
- Shingles
- Nails
- Starter strip
- Hip/ridge caps
- Ice & water shield
- Pipe flashing

---

## 7. COLOR SCHEME
- Primary: #1E3A5F (Deep Blue)
- Secondary: #FF6B35 (Orange)
- Success: #38A169
- Warning: #D69E2E
- Danger: #E53E3E
- Background: #F5F7FA

---

## 8. FILE STRUCTURE
```
jax-roofing-app/
├── SPEC.md              # This specification
├── index.html           # Main HTML/CSS/JS
├── app.js               # Core logic
├── ui-functions.js      # UI interactions
├── extended-features.js # Extended features
└── README.md            # Documentation
```

---

## 9. DEPLOYMENT
- Static HTML file
- Host on any web server
- Works in any modern browser
- No server required

---

*Last Updated: April 12, 2026*
*Built by Jax (Self-Improving AI)*