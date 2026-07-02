'use client';

import { useAuth } from '@/lib/auth-context';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TopNav from '@/components/TopNav';
import { ENUGU_AREAS } from '@/lib/mock-data';
import { User } from '@/lib/types';

const badgeEmoji: Record<string, string> = {
  first_report: '🚀',
  reporter_5: '⭐',
  reporter_10: '✨',
  infrastructure_hero: '🦸',
  community_leader: '👑',
  water_guardian: '💧',
};

export default function LeaderboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedArea, setSelectedArea] = useState('global');
  const [leaderboardData, setLeaderboardData] = useState<(User & { rank: number })[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const stored = localStorage.getItem('vale:users');
    const allUsers = stored ? JSON.parse(stored) : [];
    setUsers(allUsers);
  }, []);

  useEffect(() => {
    let filtered = users.filter((u) => u.role === 'resident');

    if (selectedArea !== 'global' && selectedArea) {
      filtered = filtered.filter((u) => u.area === selectedArea);
    }

    const sorted = [...filtered].sort((a, b) => b.points - a.points);
    const ranked = sorted.map((u, i) => ({ ...u, rank: i + 1 }));
    setLeaderboardData(ranked);
  }, [users, selectedArea]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) return null;

  const userRank = leaderboardData.find((u) => u.id === user.id)?.rank || 0;

  return (
    <div className="min-h-screen bg-white">
      <TopNav currentRole={user.role} onRoleChange={() => {}} showRoleSwitcher={false} />

      <main className="mx-auto w-full max-w-[800px] px-4 pb-20 pt-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Leaderboard</h1>
          <p className="text-gray-600 mt-2">Top infrastructure reporters in Enugu</p>
        </div>

        {/* Your Rank */}
        {userRank > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 mb-8 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">Your Rank</p>
                <p className="text-4xl font-bold text-blue-900">{userRank}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-700">Your Points</p>
                <p className="text-4xl font-bold text-blue-600">{user.points}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 block mb-2">Filter by Area</label>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="global">Global</option>
            {ENUGU_AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* Leaderboard */}
        <div className="space-y-3">
          {leaderboardData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No reporters yet. Be the first to report an issue!</p>
            </div>
          ) : (
            leaderboardData.slice(0, 50).map((u) => {
              const medalEmoji = u.rank === 1 ? '🥇' : u.rank === 2 ? '🥈' : u.rank === 3 ? '🥉' : '';
              const isCurrentUser = u.id === user.id;

              return (
                <div
                  key={u.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition ${
                    isCurrentUser
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Rank */}
                  <div className="text-center min-w-[60px]">
                    <p className="text-2xl font-bold text-gray-900">
                      {medalEmoji || `#${u.rank}`}
                    </p>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{u.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600">{u.reportCount} reports</span>
                      <span className="text-sm text-green-600 font-medium">{u.verifiedReportCount} verified</span>
                    </div>
                    {u.badges.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {u.badges.slice(0, 3).map((badge) => (
                          <span key={badge} className="text-lg" title={badge}>
                            {badgeEmoji[badge] || '🏆'}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{u.points}</p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* How to Climb */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h2 className="font-semibold text-gray-900 mb-3">How to Climb the Leaderboard</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span>📍</span>
              <span>Submit a report: <strong>+5 points</strong></span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>Get verified by AI: <strong>+10 points</strong></span>
            </li>
            <li className="flex gap-2">
              <span>🔧</span>
              <span>Report leads to repair: <strong>+25 bonus points</strong></span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
