import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/layout/Layout';
import { statsApi } from '../services/api';

interface Stats {
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  currentStreak: number;
  maxStreak: number;
  avgAttempts: number;
  attemptsDistribution: Record<number, number>; // { 1: 5, 2: 10, ... }
}

const GAME_MODES = [
  { id: 'all', label: 'All Modes' },
  { id: 'classic', label: 'Classic Mode' },
  { id: 'hardcore', label: 'Hard Mode' },
  { id: 'timer', label: 'Timer Mode' },
  { id: 'daily', label: 'Daily Word' },
];

export const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    loadStats();
  }, [user, selectedMode, navigate]);

  const loadStats = async () => {
    if (!user) return;

    try {
      setLoading(true);
      // TODO: Update API to support mode filtering
      const response = await statsApi.getStats(user.id);
      const statsData = response.data;

      // Get attempts distribution from history
      const historyResponse = await statsApi.getHistory(user.id);
      const history = historyResponse.data || [];

      // Filter by mode if not 'all'
      const filteredHistory = selectedMode === 'all' 
        ? history 
        : history.filter((h: any) => h.mode === selectedMode);

      // Calculate attempts distribution
      const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
      filteredHistory
        .filter((h: any) => h.won)
        .forEach((h: any) => {
          if (h.attemptsUsed >= 1 && h.attemptsUsed <= 6) {
            distribution[h.attemptsUsed] = (distribution[h.attemptsUsed] || 0) + 1;
          }
        });

      // Recalculate stats for selected mode
      const modeStats = {
        gamesPlayed: filteredHistory.length,
        gamesWon: filteredHistory.filter((h: any) => h.won).length,
        winRate: filteredHistory.length > 0 
          ? (filteredHistory.filter((h: any) => h.won).length / filteredHistory.length) * 100 
          : 0,
        currentStreak: statsData.currentStreak || 0,
        maxStreak: statsData.maxStreak || 0,
        avgAttempts: filteredHistory.length > 0
          ? filteredHistory.reduce((sum: number, h: any) => sum + (h.attemptsUsed || 0), 0) / filteredHistory.length
          : 0,
        attemptsDistribution: distribution,
      };

      setStats(modeStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-xl">Loading statistics...</div>
        </div>
      </Layout>
    );
  }

  if (!stats) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-xl">No statistics available</div>
        </div>
      </Layout>
    );
  }

  const maxAttemptsCount = Math.max(...Object.values(stats.attemptsDistribution), 1);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Your Statistics</h1>
          <div className="mt-4 space-y-2">
            {user?.user_metadata?.full_name || user?.user_metadata?.name ? (
              <p className="text-white text-xl font-semibold">
                {user.user_metadata.full_name || user.user_metadata.name}
              </p>
            ) : null}
            {user?.email && (
              <p className="text-gray-400">{user.email}</p>
            )}
          </div>
        </div>

        {/* Mode Selector */}
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Game Mode</label>
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {GAME_MODES.map(mode => (
              <option key={mode.id} value={mode.id}>
                {mode.label}
              </option>
            ))}
          </select>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Games Played</div>
            <div className="text-3xl font-bold text-white">{stats.gamesPlayed}</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Games Won</div>
            <div className="text-3xl font-bold text-white">{stats.gamesWon}</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Win Rate</div>
            <div className="text-3xl font-bold text-white">
              {stats.winRate.toFixed(1)}%
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Current Streak</div>
            <div className="text-3xl font-bold text-white">{stats.currentStreak}</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Max Streak</div>
            <div className="text-3xl font-bold text-white">{stats.maxStreak}</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Avg Attempts</div>
            <div className="text-3xl font-bold text-white">
              {stats.avgAttempts.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Attempts Distribution */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Guess Distribution</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map(attempt => {
              const count = stats.attemptsDistribution[attempt] || 0;
              const percentage = maxAttemptsCount > 0 
                ? (count / maxAttemptsCount) * 100 
                : 0;
              
              return (
                <div key={attempt} className="flex items-center gap-4">
                  <div className="w-8 text-gray-300 font-semibold">{attempt}</div>
                  <div className="flex-1 bg-gray-700 rounded-full h-8 overflow-hidden">
                    <div
                      className="bg-green-600 h-full flex items-center justify-end pr-2 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    >
                      {count > 0 && (
                        <span className="text-white text-sm font-semibold">{count}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSignOut}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </Layout>
  );
};

