'use client';

import { useState, useEffect } from 'react';
import TopNav from '@/components/TopNav';
import ReportIssueForm from '@/components/ReportIssueForm';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { WaterReport, User } from '@/lib/types';

type Tab = 'report' | 'leaders' | 'impact';

export default function ReportPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('report');
  const [reports, setReports] = useState<WaterReport[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const stored = localStorage.getItem('vale:resident-reports');
    setReports(stored ? JSON.parse(stored) : []);

    const usersStored = localStorage.getItem('vale:users');
    setUsers(usersStored ? JSON.parse(usersStored) : []);
  }, []);

  if (loading || !user) return null;

  const residents = users.filter((u) => u.role === 'resident').sort((a, b) => b.points - a.points);
  const resolvedReports = reports.filter((r) => r.status === 'resolved');
  const waterSaved = Math.round(resolvedReports.length * 500 + Math.random() * 2000);

  return (
    <div className="min-h-screen bg-white">
      <TopNav currentRole="resident" onRoleChange={() => {}} showRoleSwitcher={false} />

      <main className="mx-auto w-full max-w-[1200px] px-3 pb-28 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <section className="rounded-lg border border-[#d8d8d8] bg-white p-5 sm:p-8">
            {/* Tabs */}
            <div className="flex gap-1 mb-8 border-b border-[#d8d8d8]">
              {(['report', 'leaders', 'impact'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 px-4 text-sm font-medium transition capitalize ${
                    activeTab === tab
                      ? 'border-b-2 border-[#FF7B68] text-[#FF7B68]'
                      : 'text-[#5e5e5e] hover:text-black'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Report Tab */}
            {activeTab === 'report' && (
              <>
                <p className="text-sm text-[#5e5e5e]">Help</p>
                <h1 className="mt-3 text-4xl font-normal leading-[1.1] tracking-[-0.035em] text-black sm:text-[52px]">
                  Report a water issue.
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-[#5e5e5e] sm:text-base">
                  Take a photo. Tell us what happened. Your report helps fix infrastructure.
                </p>

                <div className="mt-8">
                  <ReportIssueForm
                    onSubmit={(report) => {
                      const key = 'vale:resident-reports';
                      const stored = localStorage.getItem(key);
                      const data = stored ? JSON.parse(stored) : [];
                      localStorage.setItem(key, JSON.stringify([report, ...data]));
                      setReports([report, ...data]);
                    }}
                  />
                </div>
              </>
            )}

            {/* Leaders Tab */}
            {activeTab === 'leaders' && (
              <>
                <p className="text-sm text-[#5e5e5e]">Recognition</p>
                <h1 className="mt-3 text-4xl font-normal leading-[1.1] tracking-[-0.035em] text-black sm:text-[52px]">
                  Top reporters.
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-[#5e5e5e] sm:text-base">
                  Community leaders helping fix Enugu's water infrastructure.
                </p>

                <div className="mt-8 space-y-3">
                  {residents.slice(0, 10).map((resident, idx) => (
                    <div key={resident.id} className="flex items-center justify-between p-4 border border-[#d8d8d8] rounded-lg">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-[#5e5e5e] min-w-[50px]">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                        </span>
                        <div>
                          <p className="font-medium text-black">{resident.name}</p>
                          <p className="text-xs text-[#5e5e5e]">{resident.reportCount} reports</p>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-[#FF7B68]">{resident.points}pts</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Impact Tab */}
            {activeTab === 'impact' && (
              <>
                <p className="text-sm text-[#5e5e5e]">Progress</p>
                <h1 className="mt-3 text-4xl font-normal leading-[1.1] tracking-[-0.035em] text-black sm:text-[52px]">
                  Community impact.
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-[#5e5e5e] sm:text-base">
                  How Vale is transforming water infrastructure in Enugu.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="p-4 border border-[#d8d8d8] rounded-lg">
                    <p className="text-sm text-[#5e5e5e]">Issues reported</p>
                    <p className="text-3xl font-normal text-black mt-2">{reports.length}</p>
                  </div>

                  <div className="p-4 border border-[#d8d8d8] rounded-lg">
                    <p className="text-sm text-[#5e5e5e]">Issues resolved</p>
                    <p className="text-3xl font-normal text-[#FF7B68] mt-2">{resolvedReports.length}</p>
                  </div>

                  <div className="p-4 border border-[#d8d8d8] rounded-lg">
                    <p className="text-sm text-[#5e5e5e]">Water saved daily</p>
                    <p className="text-3xl font-normal text-black mt-2">{waterSaved.toLocaleString()}L</p>
                  </div>

                  <div className="p-4 border border-[#d8d8d8] rounded-lg">
                    <p className="text-sm text-[#5e5e5e]">Active reporters</p>
                    <p className="text-3xl font-normal text-black mt-2">{new Set(reports.map((r) => r.reporterId)).size}</p>
                  </div>
                </div>
              </>
            )}
          </section>

          {/* Orange Sidebar */}
          <aside className="rounded-lg bg-[#FF7B68] p-6 text-white lg:sticky lg:top-24">
            <p className="text-xs text-[#f0f9ff]">Quick tip</p>
            <h2 className="mt-2 text-2xl font-normal">Take action.</h2>
            <div className="mt-5 space-y-4 text-sm leading-6 text-[#f0f9ff]">
              <p>✓ Photo is fastest. Use camera first.</p>
              <p>✓ Reports are reviewed within 24 hours.</p>
              <p>✓ Earn points. Climb the leaderboard.</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
