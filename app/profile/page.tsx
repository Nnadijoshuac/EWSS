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
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user.name.charAt(0)}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-600 mt-1 capitalize">{user.role.replace('_', ' ')}</p>
          {user.area && <p className="text-sm text-gray-500">{user.area}</p>}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{user.points}</p>
            <p className="text-sm text-gray-600 mt-1">Points</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{user.reportCount}</p>
            <p className="text-sm text-gray-600 mt-1">Reports</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">{user.verifiedReportCount}</p>
            <p className="text-sm text-gray-600 mt-1">Verified</p>
          </div>
        </div>

        {/* Trust Score */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between mb-2">
            <p className="font-medium text-gray-900">Community Trust Score</p>
            <p className="text-2xl font-bold text-orange-600">{user.trustScore}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-orange-400 to-yellow-400 h-2 rounded-full"
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
                <div key={badge} className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 text-center">
                  <p className="text-3xl mb-2">{badgeIcons[badge] || '🏆'}</p>
                  <p className="text-xs font-medium text-gray-900 capitalize">{badge.replace(/_/g, ' ')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {user.badges.length === 0 && user.reportCount === 0 && (
          <div className="bg-blue-50 rounded-lg p-6 text-center mb-8">
            <p className="text-lg font-medium text-blue-900">No badges yet</p>
            <p className="text-sm text-blue-700 mt-2">Start reporting infrastructure issues to earn badges!</p>
          </div>
        )}

        {/* Account Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-8">
          <h2 className="font-semibold text-gray-900 mb-4">Account Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Email</span>
              <span className="text-gray-900 font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone</span>
              <span className="text-gray-900 font-medium">{user.phone || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Member Since</span>
              <span className="text-gray-900 font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => router.push('/report')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Report Infrastructure Issue
          </button>
          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="w-full bg-red-50 text-red-600 py-3 rounded-lg font-medium hover:bg-red-100 transition"
          >
            Logout
          </button>
        </div>
      </main>
    </div>
  );
}
