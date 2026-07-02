'use client';

import { useAuth } from '@/lib/auth-context';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TopNav from '@/components/TopNav';
import { WaterReport, User } from '@/lib/types';

export default function GovernmentDashboard() {
  const { user, loading, updateUser } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<WaterReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<WaterReport | null>(null);
  const [filterStatus, setFilterStatus] = useState<'reported' | 'verified' | 'assigned' | 'resolved' | 'all'>('all');
  const [reporterInfo, setReporterInfo] = useState<Record<string, User>>({});

  useEffect(() => {
    if (!loading && (!user || user.role !== 'government')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const stored = localStorage.getItem('vale:resident-reports');
    const data = stored ? JSON.parse(stored) : [];
    setReports(data.sort((a: WaterReport, b: WaterReport) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

    const usersStored = localStorage.getItem('vale:users');
    const users: User[] = usersStored ? JSON.parse(usersStored) : [];
    const infoMap: Record<string, User> = {};
    users.forEach((u) => {
      infoMap[u.id] = u;
    });
    setReporterInfo(infoMap);
  }, []);

  if (loading || !user || user.role !== 'government') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const filteredReports = filterStatus === 'all' ? reports : reports.filter((r) => r.status === filterStatus);

  const stats = {
    total: reports.length,
    open: reports.filter((r) => r.status === 'reported' || r.status === 'verified').length,
    critical: reports.filter((r) => r.severity === 'high').length,
    resolved: reports.filter((r) => r.status === 'resolved').length,
    avgResponseTime: '2.5 hours',
  };

  const handleResolve = (reportId: string) => {
    const updated = reports.map((r) => {
      if (r.id === reportId) {
        const reporter = reporterInfo[r.reporterId];
        if (reporter) {
          reporter.points += 25;
          const users: User[] = JSON.parse(localStorage.getItem('vale:users') || '[]');
          const index = users.findIndex((u) => u.id === reporter.id);
          if (index >= 0) {
            users[index] = reporter;
            localStorage.setItem('vale:users', JSON.stringify(users));
          }
        }
        return { ...r, status: 'resolved' as const, resolvedAt: new Date().toISOString() };
      }
      return r;
    });
    setReports(updated);
    localStorage.setItem('vale:resident-reports', JSON.stringify(updated));
    setSelectedReport(null);
  };

  const handleAssign = (reportId: string) => {
    const updated = reports.map((r) => (r.id === reportId ? { ...r, status: 'assigned' as const } : r));
    setReports(updated);
    localStorage.setItem('vale:resident-reports', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-white">
      <TopNav currentRole="government" onRoleChange={() => {}} showRoleSwitcher={false} />

      <main className="mx-auto w-full max-w-[1200px] px-4 pb-20 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Government Dashboard</h1>
          <p className="text-gray-600 mt-2">Infrastructure Report Management System</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-700">Total Reports</p>
            <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <p className="text-sm text-orange-700">Open</p>
            <p className="text-3xl font-bold text-orange-900">{stats.open}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <p className="text-sm text-red-700">Critical</p>
            <p className="text-3xl font-bold text-red-900">{stats.critical}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-700">Resolved</p>
            <p className="text-3xl font-bold text-green-900">{stats.resolved}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <p className="text-sm text-purple-700">Avg Response</p>
            <p className="text-2xl font-bold text-purple-900">{stats.avgResponseTime}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['all', 'reported', 'verified', 'assigned', 'resolved'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Reports List */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: Reports List */}
          <div className="md:col-span-2">
            <div className="space-y-3">
              {filteredReports.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <p className="text-gray-500">No reports in this category</p>
                </div>
              ) : (
                filteredReports.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`w-full text-left p-4 rounded-lg border transition ${
                      selectedReport?.id === report.id
                        ? 'bg-blue-50 border-blue-400'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 capitalize">{report.type.replace(/_/g, ' ')}</span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              report.severity === 'high'
                                ? 'bg-red-100 text-red-700'
                                : report.severity === 'medium'
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {report.severity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{report.area}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(report.createdAt).toLocaleDateString()} at{' '}
                          {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          report.status === 'resolved'
                            ? 'bg-green-100 text-green-700'
                            : report.status === 'assigned'
                              ? 'bg-blue-100 text-blue-700'
                              : report.status === 'verified'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right: Report Details */}
          {selectedReport && (
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedReport.type.replace(/_/g, ' ')}</h2>
                <p className="text-sm text-gray-600 mb-4">{selectedReport.description}</p>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Location</p>
                    <p className="text-gray-900">{selectedReport.area}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Severity</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        selectedReport.severity === 'high'
                          ? 'bg-red-100 text-red-700'
                          : selectedReport.severity === 'medium'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {selectedReport.severity}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Status</p>
                    <p className="text-gray-900 capitalize">{selectedReport.status}</p>
                  </div>

                  {selectedReport.aiVerificationStatus && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">AI Verification</p>
                      <div className="flex items-center gap-2">
                        <span className="capitalize text-gray-900">{selectedReport.aiVerificationStatus}</span>
                        <span className="text-sm text-gray-600">({Math.round((selectedReport.aiConfidence || 0) * 100)}%)</span>
                      </div>
                    </div>
                  )}

                  {selectedReport.photoUrl && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Photo Evidence</p>
                      <img src={selectedReport.photoUrl} alt="Report" className="w-full h-40 object-cover rounded-lg" />
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-gray-700">Reporter</p>
                    <p className="text-gray-900">{reporterInfo[selectedReport.reporterId]?.name || 'Unknown'}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                {selectedReport.status !== 'assigned' && selectedReport.status !== 'resolved' && (
                  <button
                    onClick={() => handleAssign(selectedReport.id)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Assign to Team
                  </button>
                )}

                {selectedReport.status !== 'resolved' && (
                  <button
                    onClick={() => handleResolve(selectedReport.id)}
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition"
                  >
                    Mark as Resolved ✓
                  </button>
                )}

                {selectedReport.status === 'resolved' && (
                  <div className="bg-green-50 text-green-700 py-2 rounded-lg text-center font-medium">
                    ✓ Resolved
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
