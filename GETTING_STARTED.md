# 🚀 Getting Started - AquaTrust WaterLink

## Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher (comes with Node.js)

Check your versions:
```bash
node --version    # Should be v18+
npm --version     # Should be v9+
```

---

## Installation & Running Locally

### 1. Clone or Download the Project

```bash
cd Desktop/Serenity/EWSS
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- All required packages

### 3. Start the Development Server

```bash
npm run dev
```

You'll see:
```
▲ Next.js 16.2.9 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://192.168.x.x:3000
✓ Ready in 1.2s
```

### 4. Open in Browser

Go to: **http://localhost:3000**

You should see the AquaTrust WaterLink landing page! 🎉

---

## Available Commands

```bash
# Development server (auto-reload on changes)
npm run dev

# Production build
npm run build

# Start production build locally
npm start

# Type check without building
npx tsc --noEmit
```

---

## Project Structure

```
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Landing page (/)
│   ├── demo/page.tsx        # Resident map & search
│   ├── supplier/page.tsx    # Supplier dashboard
│   ├── admin/page.tsx       # Admin/government dashboard
│   ├── request/page.tsx     # Water request flow
│   ├── bulk/page.tsx        # Bulk community requests
│   ├── report/page.tsx      # Issue reporting
│   ├── verify/[id]/page.tsx # QR verification
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
│
├── components/              # Reusable React components
│   ├── TopNav.tsx
│   ├── RoleSwitcher.tsx
│   ├── WaterMap.tsx
│   ├── WaterSourceList.tsx
│   ├── WaterSourcePanel.tsx
│   ├── QuantitySelector.tsx
│   ├── OrderTracker.tsx
│   ├── AdminMetric.tsx
│   ├── DemandMap.tsx
│   ├── AccessGapList.tsx
│   ├── SubsidyPanel.tsx
│   ├── ComplaintList.tsx
│   ├── ReportIssueForm.tsx
│   ├── And 5 more...
│
├── lib/                     # Utilities and data
│   ├── types.ts            # TypeScript interfaces
│   ├── mock-data.ts        # Demo data (10 suppliers, 4 orders, etc.)
│   ├── pricing.ts          # Price calculation logic
│   └── utils.ts            # Helper functions
│
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── next.config.ts          # Next.js config
├── tailwind.config.ts      # Tailwind CSS config
├── postcss.config.js       # PostCSS config
├── README.md               # Full documentation
└── DEMO_WALKTHROUGH.md     # Demo guide for judges
```

---

## Demo Routes

Once the dev server is running, you can visit:

- **http://localhost:3000** - Landing page
- **http://localhost:3000/demo** - Resident map & water search (default demo)
- **http://localhost:3000/request** - Multi-step water request flow
- **http://localhost:3000/bulk** - Community bulk requests
- **http://localhost:3000/report** - Report water issues
- **http://localhost:3000/supplier** - Supplier dashboard
- **http://localhost:3000/admin** - Government admin dashboard
- **http://localhost:3000/verify/src-001** - QR verification example

---

## Quick Demo Flow

1. Go to http://localhost:3000 (landing page)
2. Click "Launch Demo"
3. You're now on the resident map view (`/demo`)
4. **Try this:**
   - Select an area from the dropdown (e.g., "New Haven")
   - Click on a water source pin on the map
   - View the details in the right panel
   - Click "Request Water"
   - Follow the multi-step flow
   - Apply the subsidy discount (40% off for Joshua Nnadi in New Haven)
   - Confirm the order and see it tracked

5. **Switch to Supplier view:**
   - Look for the role switcher at the top right
   - Select "Supplier" (🚛)
   - See incoming requests, accept one, and track it
   
6. **Switch to Admin view:**
   - Select "Admin" (📊) from the role switcher
   - See real-time demand, supply gaps, complaints, subsidy tracking

---

## Troubleshooting

### Dev server won't start

**Error:** `npm: command not found` or `npm not recognized`
- Install Node.js from https://nodejs.org/ (v18 or newer)
- Restart your terminal

**Error:** `EADDRINUSE: address already in use :::3000`
- Port 3000 is taken by another app
- Kill the process or use a different port:
  ```bash
  npm run dev -- -p 3001
  ```

**Error:** `Cannot find module '@/...'`
- Run `npm install` again
- Delete `.next` folder and `.next`
- Run `npm run dev` again

### Styles not loading

- Tailwind CSS should compile automatically
- If not, try:
  ```bash
  npm run build
  npm start
  ```

### Changes not reflecting

- Next.js has hot reload enabled
- If changes don't show, try:
  - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
  - Restart the dev server (Ctrl+C, then `npm run dev` again)

### TypeScript errors in console

- These are usually safe - the dev server will still run
- For production, run: `npm run build`

---

## Features to Try

### Resident Experience
✓ **Interactive map** - See water sources with live demand
✓ **Filters** - By type, availability, verification status
✓ **Multi-step request** - Location → Source → Quantity → Review → Confirm
✓ **Smart pricing** - Shows breakdown: water cost + delivery - subsidy
✓ **Government subsidy** - 40% discount for Joshua Nnadi in New Haven
✓ **Order tracking** - Real-time status updates
✓ **Bulk requests** - Join neighbors to save money

### Supplier Features
✓ **Status management** - Toggle Available/Busy/Offline
✓ **Inventory tracking** - See tank capacity
✓ **Order management** - Accept/reject/track orders
✓ **Ratings** - Community feedback visible

### Government/Admin Features
✓ **Live demand map** - Heatmap by area
✓ **Supply coverage** - Identify gaps
✓ **Access gaps** - Alerts on underserved areas
✓ **Subsidy tracking** - Monitor usage
✓ **Complaint analysis** - By type and area
✓ **Supplier verification** - Manage approvals

---

## Technology Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** React 19
- **State:** React hooks + localStorage
- **Data:** Client-side mock (no backend)

---

## Production Build

To create an optimized production build:

```bash
npm run build      # Creates .next directory
npm start          # Runs production build locally
```

This can be deployed to:
- Vercel (recommended for Next.js)
- Netlify
- Any Node.js hosting

---

## Environment Variables

Currently not needed (no backend). In `.env.example` you'll see examples for future production:
- API URL
- Payment gateway keys
- Database URLs
- etc.

---

## Performance

The prototype is optimized for demo:
- ✓ Fast build times (10s)
- ✓ Instant interactions (client-side state)
- ✓ Responsive design
- ✓ No external API calls
- ✓ CSS-based mock map (lightweight)

---

## Next Steps

1. **Run locally:** `npm run dev`
2. **Explore the demo:** Visit each route and role
3. **Check DEMO_WALKTHROUGH.md** for a guided tour
4. **Read README.md** for the full product story
5. **Show judges** the complete user experiences

---

## Questions?

- **"How do I stop the dev server?"** - Press `Ctrl+C` in the terminal
- **"Will my changes be lost?"** - Only if you restart without `npm run dev`
- **"Can I edit the mock data?"** - Yes, edit `/lib/mock-data.ts` and changes appear instantly
- **"Is this production-ready?"** - It's a polished hackathon prototype. Production would need backend APIs, real payment processing, database, etc.

---

**Enjoy exploring AquaTrust WaterLink! 💧**
