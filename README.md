# 💧 Kwnch

**Find water. Request water. Help Enugu see where water is needed.**

A digital water access and distribution platform built for the Enugu Water Sustainability Hackathon.

---

## 🎯 Problem Statement

Many Enugu residents struggle with:
- **Unavailable information** about where water is currently available
- **No easy access** to verified tankers, boreholes, and public water points
- **Hidden pricing** and unverified suppliers
- **Lack of visibility** for government/agencies to understand demand and supply gaps

## ✨ Solution

Kwnch connects residents to verified water sources while giving government real-time visibility into water demand, supply, and community needs.

### Three Core Value Propositions

**For Residents:**
- Find nearby verified tankers, boreholes, and public water points instantly
- Request water delivery with transparent pricing
- Apply government subsidy vouchers automatically
- Join community bulk requests to save money
- Report water quality issues and track resolution
- Real-time order tracking

**For Water Suppliers:**
- Manage availability and inventory
- Accept/reject orders from residents
- Build verified reputation and ratings
- Access local demand insights
- Track orders end-to-end

**For Government & Agencies:**
- Real-time demand map by area
- Supply coverage gaps and hotspots
- Subsidy utilization tracking
- Complaint monitoring and patterns
- Data-driven infrastructure planning
- Supplier verification management

---

## 🚀 Key Features

### Resident Experience
- 🗺️ **Interactive Map** - See water sources near you with real-time availability
- 📍 **Quick Request** - Multi-step flow: location → source → quantity → review → confirm
- 💰 **Smart Pricing** - Transparent breakdown: water cost + delivery - subsidy = total
- 🏛️ **Subsidy Support** - Automatic discount application for eligible residents
- 👥 **Bulk Requests** - Join neighbors to split costs (20-30% savings)
- 📢 **Issue Reporting** - Report dirty water, failed delivery, overpricing, fake tankers
- ✓ **QR Verification** - Scan supplier QR codes to verify authenticity
- 📊 **Order Tracking** - Status: Requested → Accepted → On the Way → Delivered

### Supplier Dashboard
- ✓ **Status Management** - Toggle between Available/Busy/Offline
- 📦 **Inventory Tracking** - Real-time water capacity
- 📋 **Order Management** - Accept/reject incoming requests
- 🚛 **Delivery Status** - Mark on the way and delivered
- ⭐ **Ratings & Reputation** - Community feedback visible
- 💡 **Local Insights** - See demand trends in your area

### Admin Dashboard
- 📊 **Live Demand Map** - Heat map of water requests by area
- 📈 **Supply Coverage** - Identify gaps between demand and suppliers
- ⚠️ **Access Gaps** - Alert on underserved communities
- 💚 **Subsidy Tracking** - Monitor voucher usage and reach
- 📢 **Complaint Analysis** - Review issues by type, area, severity
- ✓ **Supplier Verification** - Approve/suspend suppliers
- 💡 **Insights** - Actionable recommendations for policy

---

## 📁 Project Structure

```
/app
  /page.tsx                    # Landing page
  /demo/page.tsx               # Resident map & source list
  /supplier/page.tsx           # Supplier dashboard
  /admin/page.tsx              # Government admin dashboard
  /request/page.tsx            # Multi-step water request flow
  /bulk/page.tsx               # Community bulk requests
  /report/page.tsx             # Report water issues
  /verify/[id]/page.tsx        # QR verification page
  layout.tsx
  globals.css

/components
  RoleSwitcher.tsx             # Demo role switcher
  TopNav.tsx                   # Header with role & area selector
  WaterMap.tsx                 # Interactive map mockup (CSS-based)
  WaterSourceList.tsx          # List of water sources
  WaterSourcePanel.tsx         # Details panel for selected source
  QuantitySelector.tsx         # Choose water quantity
  OrderTracker.tsx             # Track order status
  StatusPill.tsx               # Status badge component
  VerificationBadge.tsx        # Verification status display
  AdminMetric.tsx              # Admin dashboard metric card
  DemandMap.tsx                # Admin demand visualization
  AccessGapList.tsx            # Admin access gap alerts
  SubsidyPanel.tsx             # Admin subsidy tracking
  ComplaintList.tsx            # Admin complaint review
  SupplierStatusToggle.tsx      # Supplier status switcher
  CommunityBulkRequest.tsx      # Bulk request cards
  ReportIssueForm.tsx          # Water issue report form

/lib
  types.ts                     # TypeScript interfaces
  mock-data.ts                 # Mock data for demo
  pricing.ts                   # Pricing calculation logic
  utils.ts                     # Helper functions

/styles
  globals.css                  # Tailwind globals & custom styles

package.json
tsconfig.json
tailwind.config.ts
postcss.config.js
next.config.ts
```

---

## 💻 Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React hooks + localStorage
- **Components:** Client-side React components
- **Demo Data:** Mock data in `/lib/mock-data.ts`

---

## 🎮 How to Run

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Flow

1. **Landing Page** (`/`) - Introduces Kwnch
2. **Launch Demo** - Switch to resident/supplier/admin role at the top
3. **Resident Flow** (`/demo`):
   - See water sources on interactive map
   - Filter by type, availability, verification
   - Select a source and view details
   - Click "Request Water" to start order flow
4. **Request Flow** (`/request`):
   - Choose location
   - Select water source
   - Choose quantity
   - Review pricing with subsidy option
   - Confirm and track order
5. **Supplier View** (`/supplier`):
   - Toggle availability status
   - Accept/reject incoming orders
   - Mark orders on the way and delivered
6. **Admin View** (`/admin`):
   - See live demand by area
   - Identify supply gaps
   - Monitor complaints
   - Track subsidy usage
7. **Other Pages**:
   - `/bulk` - Join or create community bulk requests
   - `/report` - Report water issues
   - `/verify/[id]` - QR verification for water sources

---

## 📊 Mock Data

### Demo Residents
- Joshua Nnadi (New Haven) - Has active subsidy voucher (40% off up to 1,000L)

### Water Sources (10 suppliers)
- Fresh Water Tanker Co. (Independence Layout)
- Crystal Pure Borehole (New Haven)
- Abakpa Public Water Point
- Emene Rapid Water
- Government Subsidized Truck
- GRA Borehole Network
- Thinkers Corner Public Tap
- Ogui Express Water
- Uwani Quality Borehole
- Trans Ekulu Municipal Water

### Sample Orders
- 4 mock orders at different statuses (requested, accepted, on_the_way, delivered)

### Sample Reports
- 6 mock complaints (dirty water, failed delivery, overpricing, etc.)

### Subsidy Vouchers
- 1 demo voucher for Joshua Nnadi (40% off, max 1,000L)

### Bulk Requests
- 3 active community bulk requests in different areas

### Areas
- 13 Enugu neighborhoods with realistic demand/supply data

---

## 🎨 Design System

### Colors
- **Background:** #F7FBFF (water-50)
- **Surface:** #FFFFFF (white)
- **Primary:** #0EA5E9 (water-600)
- **Deep Blue:** #0369A1 (water-700)
- **Text:** #0B1F33 (water-900)
- **Muted:** #64748B (gray)
- **Success:** #10B981 (green)
- **Warning:** #F59E0B (orange)
- **Danger:** #EF4444 (red)

### Typography
- Headings: Bold, confident, clear hierarchy
- Body: Clean, readable, good line-height
- Font stack: System fonts (-apple-system, Segoe UI, etc.)

### Components
- Cards with subtle borders and shadows
- Status pills (color-coded)
- Large, tappable buttons
- Validation feedback
- Loading states
- Empty states
- Success states

---

## 🔐 Verification & Trust

Each water source has:
- ✓ Operator verification status (Pending/Verified/Suspended)
- ✓ Quality check date
- ✓ Community rating (1-5 stars)
- ✓ Review count
- ✓ Complaint tracking
- ✓ QR code for authenticity

Admin can:
- Review pending supplier applications
- Approve verified suppliers
- Suspend suppliers with quality/conduct issues
- Monitor complaint patterns

---

## 📱 Mobile Experience

The prototype is **mobile-first**:
- Full responsive design
- Large touch targets
- Bottom sheets for details
- Optimized maps for small screens
- Quick filters and sorting
- Simple multi-step flows

---

## 🚀 Future Improvements

### Phase 2
- Real GPS location integration
- Live tanker dispatch system
- SMS/USSD ordering for feature phones
- Water quality testing API integration
- IoT tank level sensors
- Payment integration (Paystack, Flutterwave)
- Push notifications

### Phase 3
- Public water infrastructure planning dashboard
- Integration with state water agencies
- Bulk pricing negotiation backend
- Supplier performance scoring algorithm
- Offline-first mobile app
- AR water source locator
- Community leaderboard

### Phase 4
- Supply chain optimization
- Predictive demand modeling
- Dynamic pricing for high-demand areas
- Insurance options for water quality
- Carbon tracking (eco-friendly tankers)
- Government subsidy distribution automation

---

## 🎯 Hackathon Alignment

**Problem Solved:**
✓ Solves water **availability** problem - residents know where water is now
✓ Solves water **access** problem - easy booking through verified sources
✓ Solves **trust** problem - verified, rated suppliers with complaint tracking

**Government Value:**
✓ Real-time demand visibility → better planning
✓ Supply gap identification → target new suppliers
✓ Complaint patterns → quality control focus
✓ Subsidy tracking → efficient allocation

**Demo-Ready:**
✓ Full working prototype
✓ No backend required (mock data)
✓ All user flows working
✓ Beautiful, polished UI
✓ Responsive design
✓ Multiple role experiences

---

## 👥 User Roles & Flows

### Role Switcher
Top right navigation has a quick role switcher:
- 👤 Resident (default)
- 🚛 Supplier
- 📊 Admin

Switching roles takes you to that role's main dashboard/experience.

### Resident (Default)
- Home: `/demo` - Map + source list
- Order: `/request` - Multi-step request flow
- Bulk: `/bulk` - Join or create group requests
- Report: `/report` - Report water issues
- Verify: `/verify/[id]` - QR code verification

### Supplier
- Home: `/supplier` - Order management dashboard
- Can accept/reject/track orders
- Can toggle availability status
- See ratings and complaints

### Admin
- Home: `/admin` - Government dashboard
- See demand/supply maps
- Monitor complaints
- Track subsidies
- Manage supplier verification

---

## 📝 Notes

- All data is **client-side mock data** (no backend)
- State persists in **React hooks** (reset on page refresh)
- Responsive design works from mobile to desktop
- No external APIs required (except Next.js defaults)
- CSS-based mock map (not Google Maps)
- All interactions work instantly (no network latency)

---

## 🙌 Built For

**Enugu Water Sustainability Hackathon**

This prototype demonstrates a viable path to solving water availability and access challenges in Enugu through technology, verification, community coordination, and government visibility.

The platform can scale to support other Nigerian cities and African markets facing similar water challenges.

---

## 📄 License

Built as a hackathon prototype. For production use, see licensing and regulatory requirements with Enugu State authorities.

---

**Let's make water access better for Enugu. 💧**
#   E W S S  
 