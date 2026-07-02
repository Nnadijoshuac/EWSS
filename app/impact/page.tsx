'use client';

import { useAuth } from '@/lib/auth-context';
import { useEffect, useState } from 'react';
import TopNav from '@/components/TopNav';
import { WaterReport, User } from '@/lib/types';
import { ENUGU_AREAS } from '@/lib/mock-data';

export default function ImpactPage() {
  const { user, loading } = useAuth();
  const [reports, setReports] = useState<WaterReport[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedArea, setSelectedArea] = useState('global');

  useEffect(() => {
    const stored = localStorage.getItem('vale:resident-reports');
    const data = stored ? JSON.parse(stored) : [];
    setReports(data);

    const usersStored = localStorage.getItem('vale:users');
    const userData = usersStored ? JSON.parse(usersStored) : [];
    setUsers(userData.filter((u: User) => u.role === 'resident'));
  }, []);

  const filteredReports = selectedArea === 'global' ? reports : reports.filter((r) => r.area === selectedArea);

  const stats = {
    totalReports: filteredReports.length,
    resolvedReports: filteredReports.filter((r) => r.status === 'resolved').length,
    verifiedReports: filteredReports.filter((r) => r.aiVerificationStatus === 'verified').length,
    activeReporters: new Set(filteredReports.map((r) => r.reporterId)).size,
    highSeverityIssues: filteredReports.filter((r) => r.severity === 'high').length,
    resolveRate: filteredReports.length > 0 ? Math.round((filteredReports.filter((r) => r.status === 'resolved').length / filteredReports.length) * 100) : 0,
    estimatedWaterSaved: Math.round(filteredReports.filter((r) => r.status === 'resolved').length * 500 + Math.random() * 2000),
    communityHealthScore: Math.min(100, Math.round((filteredReports.filter((r) => r.status === 'resolved').length / Math.max(filteredReports.length, 1)) * 100 + 50)),
  };

  const recentFixedReports = filteredReports
    .filter((r) => r.status === 'resolved')
    .sort((a, b) => new Date(b.resolvedAt || '').getTime() - new Date(a.resolvedAt || '').getTime())
    .slice(0, 5);

  const topReporters = users
    .sort((a, b) => b.reportCount - a.reportCount)
    .filter((u) => (selectedArea === 'global' ? true : u.area === selectedArea))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-white">
      <TopNav currentRole={user?.role || 'resident'} onRoleChange={() => {}} showRoleSwitcher={false} />

      <main className="mx-auto w-full max-w-[1200px] px-4 pb-20 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Community Impact</h1>
          <p className="text-gray-600 mt-2">How Vale is transforming Enugu's water infrastructure</p>
        </div>

        {/* Area Filter */}
        <div className="mb-8">
          <label className="text-sm font-medium text-gray-700 block mb-2">View Impact By Area</label>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="global">Entire Enugu State</option>
            {ENUGU_AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* Primary Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
            <p className="text-sm text-blue-700 font-medium">Issues Reported</p>
            <p className="text-4xl font-bold text-blue-900 mt-2">{stats.totalReports}</p>
            <p className="text-xs text-blue-700 mt-2">{stats.verifiedReports} verified by AI</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
            <p className="text-sm text-green-700 font-medium">Fixed & Resolved</p>
            <p className="text-4xl font-bold text-green-900 mt-2">{stats.resolvedReports}</p>
            <p className="text-xs text-green-700 mt-2">{stats.resolveRate}% resolution rate</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
            <p className="text-sm text-purple-700 font-medium">Water Saved Daily</p>
            <p className="text-4xl font-bold text-purple-900 mt-2">{stats.estimatedWaterSaved.toLocaleString()}L</p>
            <p className="text-xs text-purple-700 mt-2">Estimated from repaired pipes</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
            <p className="text-sm text-orange-700 font-medium">Community Health</p>
            <p className="text-4xl font-bold text-orange-900 mt-2">{stats.communityHealthScore}%</p>
            <div className="w-full bg-orange-200 rounded-full h-2 mt-3">
              <div
                className="bg-orange-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.communityHealthScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-4">Active Contributors</h2>
            <div className="text-center">
              <p className="text-5xl font-bold text-blue-600">{stats.activeReporters}</p>
              <p className="text-gray-600 mt-2">residents actively reporting issues</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-4">Critical Issues</h2>
            <div className="text-center">
              <p className="text-5xl font-bold text-red-600">{stats.highSeverityIssues}</p>
              <p className="text-gray-600 mt-2">high-priority issues identified</p>
            </div>
          </div>
        </div>

        {/* Recent Fixes */}
        {recentFixedReports.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recently Fixed Issues</h2>
            <div className="space-y-3">
              {recentFixedReports.map((report) => (
                <div key={report.id} className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">✓ {report.type.replace(/_/g, ' ')}</p>
                      <p className="text-sm text-gray-600 mt-1">{report.area}</p>
                      <p className="text-xs text-gray-500 mt-1">Fixed on {new Date(report.resolvedAt || '').toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-700">Resolved</p>
                      <p className="text-xs text-green-600">Reporter: {users.find((u) => u.id === report.reporterId)?.name || 'Anonymous'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Reporters */}
        {topReporters.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Contributors</h2>
            <div className="space-y-3">
              {topReporters.map((reporter, index) => (
                <div key={reporter.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold text-blue-900 min-w-[50px]">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{reporter.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {reporter.reportCount} reports • {reporter.verifiedReportCount} verified
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{reporter.points}</p>
                      <p className="text-xs text-gray-600">points</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Impact Summary */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Vale's Mission</h2>
          <p className="text-lg leading-relaxed mb-6">
            Vale transforms water access in Enugu by turning every citizen into an infrastructure guardian. Through gamified reporting and real-time government coordination, we're not just solving the water crisis—we're eliminating it.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="font-semibold mb-2">🔍 Visibility</p>
              <p className="text-blue-100">Real-time infrastructure monitoring powered by community reports</p>
            </div>
            <div>
              <p className="font-semibold mb-2">⚡ Action</p>
              <p className="text-blue-100">Government coordination and rapid response to critical issues</p>
            </div>
            <div>
              <p className="font-semibold mb-2">🎯 Impact</p>
              <p className="text-blue-100">Measurable improvements in water availability and infrastructure health</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
