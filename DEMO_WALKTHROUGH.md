# 💧 AquaTrust WaterLink - Demo Walkthrough

## Quick Start (30-60 seconds)

1. **Start the app:**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000

2. **Landing Page** (http://localhost:3000)
   - Shows the problem and solution
   - Click "Launch Demo" to enter resident view

---

## Full Demo Flow (5-10 minutes)

### 1. **Landing Page** - Introduce the Problem (1 min)
- **URL:** http://localhost:3000
- **Message:** "Water access should not be guesswork"
- **Point:** Show the three user groups (Residents, Suppliers, Gov) and impact metrics
- **CTA:** "Launch Demo"

---

### 2. **Resident View - Find Water** (2-3 mins)
- **URL:** http://localhost:3000/demo
- **What to show:**
  - Interactive map showing water sources near Enugu
  - Filter by type (tanker, borehole, public point, subsidized)
  - See demand bubbles overlaid on map
  - Left panel shows list of sources with prices, ratings, distance

- **Interactions:**
  1. Click on a water source marker on the map
  2. Show the details panel on the right
  3. Point out: verification badge ✓, rating ⭐, price per litre, availability status
  4. Show filters: "Verified Only", "Available Now"
  5. Select different water types and see results update

---

### 3. **Request Water Flow** (2-3 mins)
- **URL:** http://localhost:3000/request (or click "Request Water" button)
- **Step-by-step:**

  **Step 1: Location**
  - Select area (e.g., "New Haven")
  - Click "Next"

  **Step 2: Choose Source**
  - Show nearby sources in that area
  - Select "Government Subsidized Truck" or "Fresh Water Tanker"
  - Click "Next"

  **Step 3: Choose Quantity**
  - Show preset buttons: 25L, 50L, 100L, 500L, 1,000L, 5,000L
  - Can also type custom amount
  - Click "Next"

  **Step 4: Review & Pricing**
  - Show pricing breakdown:
    - Water cost (quantity × price/L)
    - Delivery fee (distance × 500)
    - **Government subsidy available!** (40% off)
  - Click "Apply Subsidy Voucher" to see discount applied
  - **Point out:** "This resident (Joshua Nnadi) has a subsidy voucher for this area"
  - Total cost shows discount clearly
  - Click "Confirm Order"

  **Step 5: Order Confirmation**
  - Show order tracker with status flow
  - Order goes through: Requested → Accepted → On the Way → Delivered
  - Display estimated delivery time
  - Show order details: source name, quantity, cost, subsidy applied

---

### 4. **Supplier View - Manage Orders** (1-2 mins)
- **URL:** http://localhost:3000/supplier
- **What to show:**
  - Supplier status toggle: Available / Busy / Offline
  - Water tank capacity (8,000L remaining)
  - Price per litre
  - **Incoming requests** section (showing yellow - waiting to accept)
    - Click "Accept" to move to accepted orders
  - **Accepted orders** section (blue)
    - Click "Mark On The Way" to move to in-transit
  - **On The Way** section (cyan)
    - Click "Mark Delivered" to complete order
  - Show ratings and complaint count at bottom

---

### 5. **Government/Admin View - Real-time Insights** (2 mins)
- **URL:** http://localhost:3000/admin
- **What to show:**
  1. **Key Metrics** (top)
     - Active requests: 4
     - Active suppliers: 8
     - Verified sources: 9
     - Open complaints: 6

  2. **Live Demand Map**
     - Shows demand by area with bar charts
     - Supply coverage ratio (green = covered, red = gap)
     - Areas with highest demand: New Haven (72), Thinkers Corner (54), Independence Layout (45)

  3. **Access Gaps & Issues**
     - Abakpa: 34 requests, only 2 suppliers (GAP: 32)
     - Emene: Rising dirty water complaints
     - Thinkers Corner: Public water point offline

  4. **Subsidy Distribution**
     - 1 active voucher
     - Tracking usage and coverage

  5. **Recent Complaints**
     - Dirty water in Emene (High, Reviewing)
     - Failed delivery in Thinkers Corner (Medium)
     - Overpricing in Emene (Medium)

  6. **Insights & Actions**
     - Abakpa needs supplier recruitment
     - Subsidy usage at 68% in New Haven
     - Quality inspections needed in Emene
     - Public infrastructure gaps in Nsukka

---

### 6. **Additional Features** (Optional, if time allows)

#### A. **Community Bulk Requests** (http://localhost:3000/bulk)
- Show existing bulk requests
- "Thinkers Corner Street 4" - 23 households joined, 10,000L needed
- Click "Join Request" to save money by grouping orders
- Cost per household drops as more people join

#### B. **Report Water Issue** (http://localhost:3000/report)
- Show complaint types: Dirty water, Failed delivery, Overpricing, Fake tanker, etc.
- Fill out a sample report
- Show it gets submitted and categorized by severity
- Admin sees these in the dashboard

#### C. **QR Verification** (http://localhost:3000/verify/src-001)
- Shows verification details when you scan a supplier QR code
- Proves the source is legitimate
- Shows quality check date, operator info, ratings
- Click to request water from verified source

---

## Role Switcher

At the top right of every page (except landing), there's a **Role Switcher**:
- 👤 Resident
- 🚛 Supplier  
- 📊 Admin

Judges can quickly switch between views to see how each user group experiences the platform.

---

## Key Demo Points to Emphasize

### Problem Solved
✓ **Water Availability** - Residents know exactly where water is available right now
✓ **Water Access** - Easy booking through verified, rated suppliers
✓ **Trust** - QR verification, quality checks, community ratings, complaint tracking

### Government Value
✓ **Real-time demand visibility** → Better planning
✓ **Supply gap identification** → Target resources
✓ **Complaint patterns** → Quality control
✓ **Subsidy tracking** → Efficient allocation

### Technical Excellence
✓ Clean, modern, polished UI
✓ Responsive design (mobile-first)
✓ No backend needed (perfect for hackathon)
✓ Mock data with realistic scenarios
✓ Multiple complete user flows
✓ Built with Next.js 16, TypeScript, Tailwind

---

## Demo Video Sequence (If Recording)

1. **0:00-0:15** - Landing page, show problem statement
2. **0:15-1:00** - Resident view: Filter and select water source
3. **1:00-2:00** - Request flow: Location → Source → Quantity → Apply subsidy → Confirm
4. **2:00-2:30** - Order tracker showing status progression
5. **2:30-3:15** - Switch to Supplier view, accept order, mark in transit
6. **3:15-4:15** - Admin dashboard: Show demand map, access gaps, complaints, insights
7. **4:15-4:45** - Show bulk requests and issue reporting
8. **4:45-5:00** - QR verification flow
9. **5:00+** - Closing: "This gives residents, suppliers, and government visibility into Enugu's water ecosystem"

---

## FAQ for Judges

**Q: Is this connected to a real backend?**
A: No, it's a prototype with client-side mock data. Perfect for a hackathon. In production, it would connect to APIs for real-time data.

**Q: How does the subsidy work?**
A: Residents with active vouchers (like Joshua Nnadi) automatically get discounts. The admin dashboard tracks usage to ensure equitable distribution.

**Q: What about payment?**
A: This prototype doesn't process payments (no backend). In production, it would integrate Paystack/Flutterwave.

**Q: Can suppliers reject orders?**
A: Yes, they can click "Reject". In the demo, most will show as accepted to keep the flow smooth.

**Q: How does verification work?**
A: Operators apply, get verified, can be suspended if complaints rise. QR codes provide a tangible trust mechanism. The admin can see pending supplier applications.

---

## Troubleshooting

**Dev server won't start?**
```bash
npm install
npm run dev
```

**Styles not loading?**
- Tailwind CSS builds automatically, but if styles are missing:
  ```bash
  npm run build
  npm start
  ```

**Port 3000 already in use?**
```bash
npm run dev -- -p 3001
```

---

Enjoy the demo! 💧
