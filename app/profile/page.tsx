'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import TopNav from '@/components/TopNav';

const badgeIcons: Record<string, string> = {
  first_report: '🚀',
  reporter_5: '⭐',
  reporter_10: '✨',
  infrastructure_hero: '🦸',
  community_leader: '👑',
  water_guardian: '💧',
};

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <TopNav currentRole={user.role} onRoleChange={() => {}} showRoleSwitcher={false} />

      <main className="mx-auto w-full max-w-[600px] px-4 pb-20 pt-24">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#FF7B68] rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user.name.charAt(0)}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-600 mt-1 capitalize">{user.role.replace('_', ' ')}</p>
          {user.area && <p className="text-sm text-gray-500">{user.area}</p>}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white border border-[#d8d8d8] rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-[#FF7B68]">{user.points}</p>
            <p className="text-sm text-gray-600 mt-1">Points</p>
          </div>
          <div className="bg-white border border-[#d8d8d8] rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-gray-900">{user.reportCount}</p>
            <p className="text-sm text-gray-600 mt-1">Reports</p>
          </div>
          <div className="bg-white border border-[#d8d8d8] rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-gray-900">{user.verifiedReportCount}</p>
            <p className="text-sm text-gray-600 mt-1">Verified</p>
          </div>
        </div>

        {/* Trust Score */}
        <div className="bg-white border border-[#d8d8d8] rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="font-medium text-gray-900">Community Trust</p>
            <p className="text-2xl font-bold text-[#FF7B68]">{user.trustScore}%</p>
          </div>
          <div className="w-full bg-[#e8e8e8] rounded-full h-2">
            <div
              className="bg-[#FF7B68] h-2 rounded-full"
              style={{ width: `${user.trustScore}%` }}
            ></div>
          </div>
        </div>

        {/* Badges */}
        {user.badges.length > 0 && (
          <div className="mb-8">
            <h2 className="font-semibold text-gray-900 mb-4">Badges</h2>
            <div className="grid grid-cols-3 gap-3">
              {user.badges.map((badge) => (
                <div key={badge} className="bg-white border border-[#d8d8d8] rounded-lg p-4 text-center">
                  <p className="text-3xl mb-2">{badgeIcons[badge] || '🏆'}</p>
                  <p className="text-xs font-medium text-gray-900 capitalize">{badge.replace(/_/g, ' ')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {user.badges.length === 0 && user.reportCount === 0 && (
          <div className="bg-white border border-[#d8d8d8] rounded-lg p-6 text-center mb-8">
            <p className="text-lg font-medium text-gray-900">No badges yet</p>
            <p className="text-sm text-gray-600 mt-2">Start reporting infrastructure issues to earn badges!</p>
          </div>
        )}

        {/* Account Info */}
        <div className="bg-white border border-[#d8d8d8] rounded-lg p-4 mb-8">
          <h2 className="font-semibold text-gray-900 mb-4">Account</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Email</span>
              <span className="text-gray-900 font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone</span>
              <span className="text-gray-900 font-medium">{user.phone || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Member since</span>
              <span className="text-gray-900 font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={() => router.push('/report')}
            className="w-full bg-[#FF7B68] text-white py-3 rounded-lg font-medium hover:bg-[#ff6a52] transition"
          >
            Report Issue
          </button>
          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="w-full bg-white border border-[#d8d8d8] text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Logout
          </button>
        </div>
      </main>
    </div>
  );
}
