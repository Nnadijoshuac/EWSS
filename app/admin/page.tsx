'use client';

import { useState } from 'react';
import TopNav from '@/components/TopNav';
import DemandMap from '@/components/DemandMap';
import AccessGapList from '@/components/AccessGapList';
import SubsidyPanel from '@/components/SubsidyPanel';
import ComplaintList from '@/components/ComplaintList';
import { UserRole } from '@/lib/types';
import {
  WATER_SOURCES,
  SAMPLE_ORDERS,
  SAMPLE_REPORTS,
  DEMO_SUBSIDY_VOUCHER,
  AREA_DEMAND_MAP,
  AREA_SUPPLY_MAP,
} from '@/lib/mock-data';

interface AccessGap {
  area: string;
  issue: string;
  severity: 'high' | 'medium' | 'low';
  action?: string;
}

export default function AdminPage() {
  const [role, setRole] = useState<UserRole>('admin');

  const activeRequests = SAMPLE_ORDERS.filter((order) => order.status !== 'delivered').length;
  const activeSources = WATER_SOURCES.filter((source) => source.status === 'available').length;
  const verifiedSources = WATER_SOURCES.filter((source) => source.verified).length;
  const totalComplaints = SAMPLE_REPORTS.length;

  const accessGaps: AccessGap[] = Object.entries(AREA_DEMAND_MAP)
    .flatMap(([area, demand]) => {
      const supply = AREA_SUPPLY_MAP[area] || 0;
      const gap = demand - supply;
      if (gap <= 10) return [];

      return {
        area,
        issue:
          gap > 20
            ? `High demand (${demand} requests) with only ${supply} suppliers`
            : `Moderate demand (${demand}) with limited coverage (${supply} suppliers)`,
        severity: gap > 20 ? ('high' as const) : ('medium' as const),
        action: gap > 20 ? 'Recruit or dispatch suppliers into this area' : 'Monitor supplier capacity',
      };
    })
    .sort((a, b) => (a.severity === 'high' ? -1 : 1));

  if (role !== 'admin') {
    return (
      <div className="min-h-screen bg-white">
        <TopNav currentRole={role} onRoleChange={setRole} showRoleSwitcher />
        <div className="mx-auto max-w-[1200px] px-4 pb-16 pt-32 sm:px-6 lg:px-8">
          <p className="text-lg text-[#5e5e5e]">Switching to {role} view...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <TopNav currentRole={role} onRoleChange={setRole} showRoleSwitcher />

      <main className="mx-auto max-w-[1200px] px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <header className="mb-12 grid gap-8 border-b border-[#d8d8d8] pb-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="mb-5 flex items-center gap-3 text-sm">
              <span className="h-2 w-2 rounded-full bg-black" aria-hidden="true" />
              <span>Enugu State</span>
              <span className="rounded-full bg-[#f6f6f6] px-3 py-1 text-xs font-medium">Government console</span>
            </div>
            <h1 className="max-w-3xl text-[42px] font-normal leading-[1.1] tracking-[-0.035em] text-black sm:text-[52px]">
              Water operations,<br />live and accountable.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#5e5e5e]">
              Track demand, verified suppliers, subsidy usage, complaints, and access gaps across Enugu.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[#f6f6f6] px-4 py-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-black" aria-hidden="true" />
            Updated just now
          </div>
        </header>

        <section aria-label="Operational summary" className="mb-16 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[#d8d8d8] bg-[#d8d8d8] lg:grid-cols-4">
          <Metric label="Active requests" value={activeRequests} note="12 added today" />
          <Metric label="Active suppliers" value={activeSources} note={`${verifiedSources} verified`} />
          <Metric label="Open complaints" value={totalComplaints} note="2 recently resolved" />
          <Metric label="Subsidy coverage" value="68%" note="New Haven leads" />
        </section>

        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-[#5e5e5e]">Today&apos;s network</p>
            <h2 className="mt-1 text-4xl font-normal tracking-[-0.03em]">Where attention is needed</h2>
          </div>
          <span className="hidden rounded-full border border-[#d8d8d8] px-4 py-2 text-sm sm:inline-flex">Live demand</span>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <DemandMap demandData={AREA_DEMAND_MAP} supplyData={AREA_SUPPLY_MAP} />
          <div className="space-y-5">
            <SubsidyPanel vouchers={[DEMO_SUBSIDY_VOUCHER]} />
            <section className="rounded-lg bg-black p-6 text-white">
              <p className="text-sm text-[#afafaf]">Recommended action</p>
              <h2 className="mt-3 text-3xl font-normal leading-tight tracking-[-0.025em]">Dispatch relief to Thinkers Corner.</h2>
              <p className="mt-4 text-sm leading-6 text-[#afafaf]">
                Demand is outpacing nearby supply and complaints are clustering around delayed deliveries.
              </p>
              <button type="button" className="mt-6 rounded-lg bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-[#f6f6f6]">
                Review dispatch plan
              </button>
            </section>
          </div>
        </div>

        <div className="mt-16 grid gap-5 lg:grid-cols-2">
          <AccessGapList gaps={accessGaps} />
          <ComplaintList complaints={SAMPLE_REPORTS} maxItems={8} />
        </div>

        <section className="mt-16 border-t border-[#d8d8d8] pt-10">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-[#5e5e5e]">Supplier verification</p>
              <h2 className="mt-1 text-4xl font-normal tracking-[-0.03em]">Pending reviews</h2>
            </div>
            <span className="rounded-full bg-[#f6f6f6] px-4 py-2 text-sm">2 pending</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              { name: 'Swift Water Tankers', area: 'Ogui', submitted: '2 days ago' },
              { name: 'Nsukka Borehole Services', area: 'Nsukka', submitted: '1 day ago' },
            ].map((item) => (
              <div key={item.name} className="rounded-lg bg-[#f6f6f6] p-6">
                <p className="text-xl font-medium text-black">{item.name}</p>
                <p className="mt-2 text-sm text-[#5e5e5e]">{item.area} · Applied {item.submitted}</p>
                <button type="button" className="mt-6 rounded-lg bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-[#333333]">Review application</button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function Metric({ label, value, note }: { label: string; value: string | number; note: string }) {
  return (
    <div className="bg-white p-5 sm:p-6">
      <p className="text-sm text-[#5e5e5e]">{label}</p>
      <p className="mt-4 text-4xl font-normal tracking-[-0.04em] text-black sm:text-5xl">{value}</p>
      <p className="mt-2 text-xs text-[#767676]">{note}</p>
    </div>
  );
}
