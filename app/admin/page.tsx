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
      <div className="min-h-screen bg-[#f7f9fb]">
        <TopNav currentRole={role} onRoleChange={setRole} showRoleSwitcher />
        <div className="container-max section-padding text-center">
          <p className="text-lg font-semibold text-[#404751]">Switching to {role} view...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <TopNav currentRole={role} onRoleChange={setRole} showRoleSwitcher />

      <main className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase text-[#404751]">Government console</p>
            <h1 className="mt-2 text-4xl font-black text-[#191c1e]">Water operations live view.</h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold text-[#404751]">
              Track demand, verified suppliers, subsidy usage, complaints, and access gaps across Enugu.
            </p>
          </div>
          <span className="rounded-lg bg-[#005e97] px-4 py-3 text-sm font-black text-white">Live data</span>
        </div>

        <section className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Metric label="Active requests" value={activeRequests} note="+12 today" />
          <Metric label="Active suppliers" value={activeSources} note={`${verifiedSources} verified`} />
          <Metric label="Open complaints" value={totalComplaints} note="-2 resolved" tone="red" />
          <Metric label="Subsidy coverage" value="68%" note="New Haven leading" tone="green" />
        </section>

        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <DemandMap demandData={AREA_DEMAND_MAP} supplyData={AREA_SUPPLY_MAP} />
          <div className="space-y-5">
            <SubsidyPanel vouchers={[DEMO_SUBSIDY_VOUCHER]} />
            <section className="rounded-lg bg-[#005e97] p-5 text-white">
              <p className="text-xs font-bold uppercase text-white/45">Recommended action</p>
              <h2 className="mt-2 text-2xl font-black">Dispatch relief to Thinkers Corner.</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-white/65">
                Demand is outpacing nearby supply and complaints are clustering around delayed deliveries.
              </p>
            </section>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <AccessGapList gaps={accessGaps} />
          <ComplaintList complaints={SAMPLE_REPORTS} maxItems={8} />
        </div>

        <section className="mt-5 rounded-lg border border-[#c0c7d2]/30 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-[#404751]">Supplier verification</p>
              <h2 className="text-2xl font-black text-[#191c1e]">Pending reviews</h2>
            </div>
            <span className="rounded-lg bg-amber-100 px-3 py-2 text-sm font-black text-amber-800">2 pending</span>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {[
              { name: 'Swift Water Tankers', area: 'Ogui', submitted: '2 days ago' },
              { name: 'Nsukka Borehole Services', area: 'Nsukka', submitted: '1 day ago' },
            ].map((item) => (
              <div key={item.name} className="rounded-lg border border-[#c0c7d2]/30 bg-[#f2f4f6] p-4">
                <p className="font-black text-[#191c1e]">{item.name}</p>
                <p className="mt-1 text-sm font-semibold text-[#404751]">
                  {item.area} - Applied {item.submitted}
                </p>
                <button className="mt-4 rounded-lg bg-[#005e97] px-4 py-2 text-sm font-black text-white">Review</button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function Metric({
  label,
  value,
  note,
  tone = 'dark',
}: {
  label: string;
  value: string | number;
  note: string;
  tone?: 'dark' | 'red' | 'green';
}) {
  const toneClass = tone === 'red' ? 'text-red-600' : tone === 'green' ? 'text-emerald-700' : 'text-[#191c1e]';

  return (
    <div className="rounded-lg border border-[#c0c7d2]/30 bg-white p-4 shadow-sm">
      <p className="text-xs font-bold uppercase text-[#404751]">{label}</p>
      <p className={`mt-2 text-3xl font-black ${toneClass}`}>{value}</p>
      <p className="mt-1 text-xs font-bold text-[#404751]">{note}</p>
    </div>
  );
}
